var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var server = require("http").createServer(app);
var port = process.env.PORT || 80;
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: false,
  })
);
app.use(bodyParser.json());
var databaseController = require("./controllers/database-controllers");

function getAuthor(req, res) {
  databaseController.searchByAuthor(req.params.name).then((data) => {
    res.json(data);
  });
}

app.get("/getAuthor/:name", getAuthor);

server.listen(port, function () {
  console.log("server listening on port: %d", port);
});

app.use(express.static(__dirname, { dotfiles: "ignore" }));
