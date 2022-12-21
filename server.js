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

//Functions
function getAuthor(req, res) {
  databaseController.searchByAuthor(req.params.name).then((data) => {
    res.json(data);
  });
}

function getPaper(req, res) {
  databaseController
    .searchByPaper(req.params.name, req.params.lengthLimit)
    .then((data) => {
      res.json(data);
    });
}

function getNeighbor(req, res) {
  console.log("req.params.name", req.params.title);
  console.log("req.params.name", req.params.lengthLimit);
  databaseController
    .getNeighborOfPaper(req.params.title, req.params.lengthLimit)
    .then((data) => {
      res.json(data);
    });
}

//Endpoints
app.get("/getPaper/:name/:lengthLimit", getPaper);
app.get("/getAuthor/:name/:lengthLimit", getAuthor);
app.get("/getNeighbor/:title/:lengthLimit", getNeighbor);

server.listen(port, function () {
  console.log("server listening on port: %d", port);
});

app.use(express.static(__dirname, { dotfiles: "ignore" }));
