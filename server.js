var express = require("express");
const cors = require('cors');
const axios = require("axios");
const model = require("./models");
const Feedback = model.Feedback;

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
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
});

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
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
    authorIds = req.body.ids;
    if (!authorIds || !isArray(authorIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getAuthors(authorIds).then((data) => {
        res.json(data);
    });
}

function getPapersWithDistanceToTheirReferences(req, res) {
    paperIds = req.body.ids;
    distance = req.body.distance;
    if (!paperIds || !isArray(paperIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getPapersWithDistanceToTheirReferences(paperIds, distance).then((data) => {
        res.json(data);
    });
}

function getPapersWithDistanceToPapersThatReferThem(req, res) {
    paperIds = req.body.ids;
    distance = req.body.distance;
    if (!paperIds || !isArray(paperIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getPapersWithDistanceToPapersThatReferThem(paperIds, distance).then((data) => {
        res.json(data);
    });
}

function getPapersWithDistanceBothDirections(req, res) {
    paperIds = req.body.ids;
    distance = req.body.distance;
    if (!paperIds || !isArray(paperIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getPapersWithDistanceBothDirections(paperIds, distance).then((data) => {
        res.json(data);
    });
}

function getPapers(req, res) {
    paperIds = req.body.ids;
    if (!paperIds || !isArray(paperIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getPapers(paperIds).then((data) => {
        res.json(data);
    });
}

function getCommonPapers(req, res) {
    authorIds = req.body.ids;
    if (!authorIds || !isArray(authorIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getCommonPapers(authorIds).then((data) => {
        res.json(data);
    });
}


function getAuthorWithPage(req, res) {
    console.log("req.params.pageNo", req.params.pageNo);

    var pageNoInt = parseInt(req.params.pageNo);
    if (pageNoInt > 0) {
        databaseController
            .getAuthorWithPage(req.params.name, pageNoInt)
            .then((data) => {
                res.json(data);
            });
    } else {
        res.status(500).json({ success: false });
    }
}

function getAuthorPageCount(req, res) {
    databaseController
        .getAuthorPageCount(req.params.name)
        .then((data) => {
            res.json(data);
        });
}

function getInfo(req, res) {

    const apiUrl = process.env.API_URL;
    const xApiKey = process.env.API_KEY;
    const corpusID = req.params.id;


    const url = `${apiUrl}/paper/CorpusID:${corpusID}`;

    axios({
            method: "get",
            url,
            params: { fields: "abstract,openAccessPdf,tldr" },
            headers: { "x-api-key": xApiKey },
        })
        .then(function(response) {
            let abstract = "";

            if (response.data.abstract != null) {
                abstract = response.data.abstract;
            }
            let url = "";
            if (response.data.openAccessPdf != null) {
                url = response.data.openAccessPdf.url;
            }

            let tldr = "";
            if (response.data.tldr != null) {
                tldr = response.data.tldr;
            }

            res.send({
                abstract: abstract,
                url: url,
                tldr: tldr
            });

        })
        .catch(function(error) {
            console.log(error);
        });
}


async function sendFeedback(req, res) {
    try {
        const feedback = await Feedback.create({
            name: req.body.name,
            surname: req.body.surname,
            point: req.body.point,
            message: req.body.message,
            mail: req.body.mail,
        });
        return res.status(201).json({ message: "Feedback saved successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getFeedbacks(req, res) {
    try {
        const feedbacks = await Feedback.findAll();
        return res.status(200).json(feedbacks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getAllRelations(req, res) {
    var paperIds = req.body.paperIds;
    var authorIds = req.body.authorIds;
    if (!paperIds || !isArray(paperIds) || !authorIds || !isArray(authorIds)) {
        res.status(500).json({ success: false });
        return;
    }
    databaseController.getAllRelations(paperIds, authorIds).then((data) => {
        res.json(data);
    });

}

function getAuthorAuthorRelation(req, res){
    databaseController
        .getAuthorAuthorRelation(req.params.id)
        .then((data) => {
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

app.put("/add/author", getAuthors);
app.put("/add/paper", getPapers);
app.put("/add/paper/dist/reference", getPapersWithDistanceToTheirReferences); // distance
app.put("/add/paper/dist/referredBy", getPapersWithDistanceToPapersThatReferThem); // distance
app.put("/add/paper/dist", getPapersWithDistanceBothDirections); // distance
app.put("/add/commonPapers", getCommonPapers);

app.get("/paper/info/:id", getInfo)

app.post("/feedback", sendFeedback)
app.get("/feedback", getFeedbacks)

app.put("/relations", getAllRelations);

app.get("/getAuthorAuthorRelation/:id", getAuthorAuthorRelation)

//---
app.get("/page/getAuthor/:name/:pageNo", getAuthorWithPage);
app.get("/page/getAuthorPageCount/:name", getAuthorPageCount);

server.listen(port, function() {
    console.log("server listening on port: %d", port);
});

app.use(express.static(__dirname, { dotfiles: "ignore" }));