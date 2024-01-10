const fs = require("fs");

const handler = (req, res) => {
  const method = req.method;
  const url = req.url;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Add Message</title><head>");
    res.write("<h1>Hello, and welcome to my 1st Assignment!.</h1>");
    res.write(
      '<body><form action="/create-user" method="POST"><input type="text" name="username" placeholder="Input your username"><button type="submit">Create</button></form>'
    );
    res.write("<h3>List of All User</h3>");

    let userList;
    try {
      userList = fs.readFileSync("List_Users.txt", "utf8");
    } catch (error) {
      userList = null;
    }
    res.write(`<pre>${userList}</pre>`);

    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsed = Buffer.concat(body).toString();
      let user = parsed.split("=")[1];
      user = user.replace(/\+/g, " ");
      user = decodeURIComponent(user);
      fs.appendFileSync("List_Users.txt", user + "\n");
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
};

module.exports = handler;
