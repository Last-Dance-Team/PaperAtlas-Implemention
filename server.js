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
const { isArray } = require("util");

//Functions
function getAuthor(req, res) {
    databaseController.searchByAuthor(req.params.name).then((data) => {
        res.json(data);
    });
}

function getPaper(req, res) {
    databaseController
        .searchByPaper(req.params.name)
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

function getAuthorsOfPaper(req, res) {
    console.log("req.params", req.params);
    databaseController.getAuthorsOfPaper(req.params.id).then((data) => {
        res.json(data);
    });
}

//COmments
// Finds the papers that refer the paper with the given id.
function getReferencesOfPaper(req, res) {
    console.log("req.params", req.params);
    databaseController.getReferencesOfPaper(req.params.id).then((data) => {
        res.json(data);
    });
}

function getReferred(req, res) {
    console.log("req.params", req.params);
    databaseController.getReferred(req.params.id).then((data) => {
        res.json(data);
    });
}


function getPapersOfAuthor(req, res) {
    console.log("req.params", req.params);
    databaseController.getPapersOfAuthor(req.params.id).then((data) => {
        res.json(data);
    });
}

function getAuthors(req, res) {
    authorIds = req.body.authorIds;
    if (!authorIds || !isArray(authorIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getAuthors(authorIds).then((data) => {
        res.json(data);
    });
}

function getPapers(req, res) {
    console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    paperIds = req.body.ids;
    if (!paperIds || !isArray(paperIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getPapers(paperIds).then((data) => {
        res.json(data);
    });
}

//Endpoints
app.get("/search/paper/:name/", getPaper); 
app.get("/search/author/:name/", getAuthor);
app.get("/getNeighbor/:title/:lengthLimit", getNeighbor);
app.get("/getAuthorsOfPapers/:id", getAuthorsOfPaper);
app.get("/getReferences/:id", getReferencesOfPaper);
app.get("/getReferred/:id", getReferred); // Finds the papers that refer the paper with the given id.
app.get("/getPapersOfAuthor/:id", getPapersOfAuthor);
app.get("/getAuthors", getAuthors);
app.put("/add/paper", getPapers);

server.listen(port, function() {
    console.log("server listening on port: %d", port);
});

app.use(express.static(__dirname, { dotfiles: "ignore" }));