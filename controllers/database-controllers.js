/*
Here we have our APIs that can be called from the frontend
*/
var basicQueries = require("../public/js/database/basic-queries");
const dbService = require("../public/js/database/db-service");

var dbControllers = {
  getAuthorPageCount: async function (author){
        let query = basicQueries.getAuthorPageCount();
        var queryData = { author: author };
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);
        let fields = resp.records[0]._fields;
        return { "totalPageCount": fields[0].low, "totalResult": fields[1].low };
    },

  getAuthorWithPage: async function (author, pageNo) {
    let query = basicQueries.getAuthorWithPage();

    var limit = 10;

    var startNo = (pageNo - 1) * limit;

    var queryData = { author: author, startNo: startNo };
    var data = { query: query, queryData: queryData };
    let resp = await dbService.runQuery(data);
    var authors = [];

    //Process the data
    var arrayOfObjects = resp.records;
    for (let i = 0; i < arrayOfObjects.length; i++) {
      var object = arrayOfObjects[i];
      var fields = object._fields;
      var data = {};
      data.name = fields[0];
      data.aliases = fields[1];
      data.id = fields[2].low;
      authors.push(data);
    }

    return { authors: authors };
  },

  getPapers: async function(paperIds) {
        let query = basicQueries.getPapers();

        var queryData = { paperIds: paperIds };
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);

        var records = resp.records;
        var nodes = [];
        var edges = [];

        for (let j = 0; j < records.length; j++) {
            var cur = records[j];
            var curPaper = cur._fields[0].properties;

            var pushPaperNode = {
                data: {
                    type: "Paper",
                    label: curPaper.title,
                    id: String(cur._fields[0].identity.low),
                    paperId: curPaper.paperId.low,
                    url: curPaper.url,
                    citationCount: curPaper.citationCount.low,
                    venue: curPaper.venue,
                    journalName: curPaper.journalName,
                    uniqueFieldsOfStudies: curPaper.uniqueFieldsOfStudies,
                    year: curPaper.year.low,
                    publicationTypes: curPaper.publicationTypes,
                    acl: curPaper.acl,
                    dblp: curPaper.dblp,
                    journalPages: curPaper.journalPages,
                    mag: curPaper.mag,
                    pubmed: curPaper.pubmed,
                    referenceCount: curPaper.referenceCount.low,
                    arXiv: curPaper.arXiv,
                    influentialCitaitonCount: curPaper.influentialCitaitonCount,
                    journalVolume: curPaper.journalVolume,
                    isOpenAccess: curPaper.isOpenAccess,
                    pubMedCentral: curPaper.pubMedCentral,
                    publicationDate: curPaper.publicationDate,
                    doi: curPaper.doi,
                },
                position: { x: 0, y: 0 },
            };
            nodes.push(pushPaperNode);

            var curRel = cur._fields[1];
            if (curRel) {
                var pushEdge = {
                    data: {
                        source: String(curRel.start.low),
                        target: String(curRel.end.low),
                        label: "a-reference-of",
                    },
                };

                edges.push(pushEdge);
            }
        }

        return { nodes: nodes, edges: edges };
    },
    getAuthors: async function(authorIds) {
        let query = basicQueries.getAuthors();

        var queryData = { authorIds: authorIds };
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);

        var nodes = [];
        var edges = [];
        var g

        var authorResp = resp.records;

        for (let j = 0; j < authorResp.length; j++) {
            var curProperties = authorResp[j]._fields[0].properties;
            var node = {
                data: {
                    type: "Author",
                    label: curProperties.name,
                    authorId: curProperties.authorId,
                    id: String(authorResp[j]._fields[0].identity.low),
                    url: curProperties.url,
                    citationCount: curProperties.citationCount.low,
                    aliases: curProperties.aliases,
                    paperCount: curProperties.paperCount.low,
                    orhids: curProperties.orhids,
                    affiliations: curProperties.affiliations,
                    homepage: curProperties.homepage,
                    hindex: curProperties.hindex.low,
                },
                position: { x: 0, y: 0 },
            };
            nodes.push(node);
        }

        return { nodes: nodes, edges: edges };
    },
    searchByAuthor: async function(author) {
        let query = basicQueries.getAuthorAndPapers(author);
        var queryData = { author: author };
        var data = { query: query, queryData: queryData };

        let resp = await dbService.runQuery(data);
        var authors = [];

        //Process the data
        var arrayOfObjects = resp.records;
        for (let i = 0; i < arrayOfObjects.length; i++) {
            var object = arrayOfObjects[i];
            var fields = object._fields;
            var data = {}
            data.name = fields[0];
            data.aliases = fields[1];
            data.id = fields[2].low;
            authors.push(data);

        }
        //  console.log("nodes", nodes);
        // console.log("edges", edges);

        return { authors: authors};
    },
    searchByPaper: async function(paper) {
        let query = basicQueries.getPaperAndPapers(paper);
        var queryData = { paper: paper };
        var data = { query: query, queryData: queryData };

        let resp = await dbService.runQuery(data);
        var nodes = [];

        //Process the data
        var arrayOfObjects = resp.records;
        for (let i = 0; i < arrayOfObjects.length; i++) {
            var object = arrayOfObjects[i];
            var fields = object._fields;
            var data = {}
            data.title = fields[0];
            data.id = fields[1].low;
            nodes.push(data);
        
        }

        //return resp;
        return { nodes: nodes };
    },
    getNeighborOfPaper: async function(title, lengthLimit) {
        let query = basicQueries.getNeighborOfPaper(title, lengthLimit);
        var queryData = {};
        var data = { query: query, queryData: queryData };

        let resp = await dbService.runQuery(data);
        console.log("resp", resp);
        if (resp.records.length > 0) {
            var nodes = [];
            var edges = [];
            for (let j = 0; j < resp.records.length; j++) {
                var fields = resp.records[j]._fields;
                var fields = resp.records[0]._fields;
                var field_nodes = fields[0];
                var field_edges = fields[1];

                console.log("fields", fields);
                for (let i = 0; i < field_nodes.length; i++) {
                    //console.log("nodes", field_nodes[i]);
                    var field = field_nodes[i];
                    node = {
                        data: {
                            type: "Paper",
                            label: field.properties.title,
                            id: String(field.identity.low),
                            paperId: field.properties.paperId.low,
                            url: field.properties.url,
                            citationCount: field.properties.citationCount.low,
                            venue: field.properties.venue,
                            journalName: field.properties.journalName,
                            uniqueFieldsOfStudies: field.properties.uniqueFieldsOfStudies,
                            year: field.properties.year.low,
                            publicationTypes: field.properties.publicationTypes,
                            acl: field.properties.acl,
                            dblp: field.properties.dblp,
                            journalPages: field.properties.journalPages,
                            mag: field.properties.mag,
                            pubmed: field.properties.pubmed,
                            referenceCount: field.properties.referenceCount.low,
                            arXiv: field.properties.arXiv,
                            influentialCitaitonCount: field.properties.influentialCitaitonCount,
                            journalVolume: field.properties.journalVolume,
                            isOpenAccess: field.properties.isOpenAccess,
                            pubMedCentral: field.properties.pubMedCentral,
                            publicationDate: field.properties.publicationDate,
                            doi: field.properties.doi,
                        },
                        position: { x: 0, y: 0 },
                    };
                    nodes.push(node);
                }

                for (let i = 0; i < field_edges.length; i++) {
                    console.log("edges", field_edges[i]);
                    var field = field_edges[i];
                    edge = {
                        data: {
                            source: String(field.start.low),
                            target: String(field.end.low),
                            label: "a-reference-of",
                        },
                    };
                    edges.push(edge);
                }
            }

            //return resp
            console.log("here", nodes, edges);
            return { nodes: nodes, edges: edges };
        } else {
            return { nodes: [], edges: [] };
        }
    },
    getAuthorsOfPaper: async function(id) {
        let query = basicQueries.getAuthorsOfPaper(id);
        var queryData = {};
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);
        console.log("resp", resp);

        //Process the data
        if (resp.records.length > 0) {
            var nodes = [];
            var edges = [];
            var authorFields = resp.records[0]._fields[0];
            var paper = resp.records[0]._fields[1][0];
            var relations = resp.records[0]._fields[2];

            //Adding author nodes
            for (let j = 0; j < authorFields.length; j++) {
                var node = {
                    data: {
                        type: "Author",
                        label: authorFields[j].properties.name,
                        authorId: authorFields[j].properties.authorId,
                        id: String(authorFields[j].identity.low),
                        url: authorFields[j].properties.url,
                        citationCount: authorFields[j].properties.citationCount.low,
                        aliases: authorFields[j].properties.aliases,
                        paperCount: authorFields[j].properties.paperCount.low,
                        orhids: authorFields[j].properties.orhids,
                        affiliations: authorFields[j].properties.affiliations,
                        homepage: authorFields[j].properties.homepage,
                        hindex: authorFields[j].properties.hindex.low,
                    },
                    position: { x: 0, y: 0 },
                };
                nodes.push(node);
            }

            //Adding paper node
            var node = {
                data: {
                    type: "Paper",
                    label: paper.properties.title,
                    id: String(paper.identity.low),
                    paperId: paper.properties.paperId.low,
                    url: paper.properties.url,
                    citationCount: paper.properties.citationCount.low,
                    venue: paper.properties.venue,
                    journalName: paper.properties.journalName,
                    uniqueFieldsOfStudies: paper.properties.uniqueFieldsOfStudies,
                    year: paper.properties.year.low,
                    publicationTypes: paper.properties.publicationTypes,
                    acl: paper.properties.acl,
                    dblp: paper.properties.dblp,
                    journalPages: paper.properties.journalPages,
                    mag: paper.properties.mag,
                    pubmed: paper.properties.pubmed,
                    referenceCount: paper.properties.referenceCount.low,
                    arXiv: paper.properties.arXiv,
                    influentialCitaitonCount: paper.properties.influentialCitaitonCount.low,
                    journalVolume: paper.properties.journalVolume,
                    isOpenAccess: paper.properties.isOpenAccess,
                    pubMedCentral: paper.properties.pubMedCentral,
                    publicationDate: paper.properties.publicationDate,
                    doi: paper.properties.doi,
                },
                position: { x: 0, y: 0 },
            };
            nodes.push(node);

            //push edges
            for (let i = 0; i < relations.length; i++) {
                var field = relations[i];
                edge = {
                    data: {
                        source: String(field.start.low),
                        target: String(field.end.low),
                        label: field.type,
                    },
                };
                edges.push(edge);
            }
            return { nodes: nodes, edges: edges };
        } else {
            return { nodes: [], edges: [] };
        }
    },
    getReferencesOfPaper: async function(id) {
        let query = basicQueries.getReferencesOfPaper(id);
        var queryData = {};
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);
        console.log("resp", resp);

        //Process the data
        if (resp.records.length > 0  && resp.records[0]._fields[0][0]) {
            var nodes = [];
            var edges = [];
            // var paper, references, relations;

            var paper = resp.records[0]._fields[1][0];
            var references = resp.records[0]._fields[0];
            var relations = resp.records[0]._fields[2];

            //Adding paper node
            var node = {
                data: {
                    type: "Paper",
                    label: paper.properties.title,
                    id: String(paper.identity.low),
                    paperId: paper.properties.paperId.low,
                    url: paper.properties.url,
                    citationCount: paper.properties.citationCount.low,
                    venue: paper.properties.venue,
                    journalName: paper.properties.journalName,
                    uniqueFieldsOfStudies: paper.properties.uniqueFieldsOfStudies,
                    year: paper.properties.year.low,
                    publicationTypes: paper.properties.publicationTypes,
                    acl: paper.properties.acl,
                    dblp: paper.properties.dblp,
                    journalPages: paper.properties.journalPages,
                    mag: paper.properties.mag,
                    pubmed: paper.properties.pubmed,
                    referenceCount: paper.properties.referenceCount.low,
                    arXiv: paper.properties.arXiv,
                    influentialCitaitonCount: paper.properties.influentialCitaitonCount.low,
                    journalVolume: paper.properties.journalVolume,
                    isOpenAccess: paper.properties.isOpenAccess,
                    pubMedCentral: paper.properties.pubMedCentral,
                    publicationDate: paper.properties.publicationDate,
                    doi: paper.properties.doi,
                },
                position: { x: 0, y: 0 },
            };
            nodes.push(node);

            // adding references
            for (let j = 0; j < references.length; j++) {
                var node = {
                    data: {
                        type: "Paper",
                        label: references[j].properties.title,
                        id: String(references[j].identity.low),
                        paperId: references[j].properties.paperId.low,
                        url: references[j].properties.url,
                        citationCount: references[j].properties.citationCount.low,
                        venue: references[j].properties.venue,
                        journalName: references[j].properties.journalName,
                        uniqueFieldsOfStudies: references[j].properties.uniqueFieldsOfStudies,
                        year: references[j].properties.year.low,
                        publicationTypes: references[j].properties.publicationTypes,
                        acl: references[j].properties.acl,
                        dblp: references[j].properties.dblp,
                        journalPages: references[j].properties.journalPages,
                        mag: references[j].properties.mag,
                        pubmed: references[j].properties.pubmed,
                        referenceCount: references[j].properties.referenceCount.low,
                        arXiv: references[j].properties.arXiv,
                        influentialCitaitonCount: references[j].properties.influentialCitaitonCount.low,
                        journalVolume: references[j].properties.journalVolume,
                        isOpenAccess: references[j].properties.isOpenAccess,
                        pubMedCentral: references[j].properties.pubMedCentral,
                        publicationDate: references[j].properties.publicationDate,
                        doi: references[j].properties.doi,
                    },
                    position: { x: 0, y: 0 },
                };
                nodes.push(node);
            }

            //push edges
            for (let i = 0; i < relations.length; i++) {
                var field = relations[i];
                edge = {
                    data: {
                        source: String(field.start.low),
                        target: String(field.end.low),
                        label: field.type,
                    },
                };
                edges.push(edge);
            }
            return { nodes: nodes, edges: edges };
        } else {
            return { nodes: [], edges: [] };
        }
    },
    getReferred: async function(id) {
        // Finds the papers that refer the paper with the given id.
        let query = basicQueries.getReferred(id);
        var queryData = {};
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);
        console.log("resp", resp);
       // return resp;

        //Process the data
        if (resp.records.length > 0 && resp.records[0]._fields[0][0]) {
            var nodes = [];
            var edges = [];
            // var paper, references, relations;

            //TODO TODO

            var paper = resp.records[0]._fields[0][0];
            var referred = resp.records[0]._fields[1];
            var relations = resp.records[0]._fields[2];

            //Adding paper node
            var node = {
                data: {
                    type: "Paper",
                    label: paper.properties.title,
                    id: String(paper.identity.low),
                    paperId: paper.properties.paperId.low,
                    url: paper.properties.url,
                    citationCount: paper.properties.citationCount.low,
                    venue: paper.properties.venue,
                    journalName: paper.properties.journalName,
                    uniqueFieldsOfStudies: paper.properties.uniqueFieldsOfStudies,
                    year: paper.properties.year.low,
                    publicationTypes: paper.properties.publicationTypes,
                    acl: paper.properties.acl,
                    dblp: paper.properties.dblp,
                    journalPages: paper.properties.journalPages,
                    mag: paper.properties.mag,
                    pubmed: paper.properties.pubmed,
                    referenceCount: paper.properties.referenceCount.low,
                    arXiv: paper.properties.arXiv,
                    influentialCitaitonCount: paper.properties.influentialCitaitonCount.low,
                    journalVolume: paper.properties.journalVolume,
                    isOpenAccess: paper.properties.isOpenAccess,
                    pubMedCentral: paper.properties.pubMedCentral,
                    publicationDate: paper.properties.publicationDate,
                    doi: paper.properties.doi,
                },
                position: { x: 0, y: 0 },
            };
            nodes.push(node);

            // adding references
            for (let j = 0; j < referred.length; j++) {
                var node = {
                    data: {
                        type: "Paper",
                        label: referred[j].properties.title,
                        id: String(referred[j].identity.low),
                        paperId: referred[j].properties.paperId.low,
                        url: referred[j].properties.url,
                        citationCount: referred[j].properties.citationCount.low,
                        venue: referred[j].properties.venue,
                        journalName: referred[j].properties.journalName,
                        uniqueFieldsOfStudies: referred[j].properties.uniqueFieldsOfStudies,
                        year: referred[j].properties.year.low,
                        publicationTypes: referred[j].properties.publicationTypes,
                        acl: referred[j].properties.acl,
                        dblp: referred[j].properties.dblp,
                        journalPages: referred[j].properties.journalPages,
                        mag: referred[j].properties.mag,
                        pubmed: referred[j].properties.pubmed,
                        referenceCount: referred[j].properties.referenceCount.low,
                        arXiv: referred[j].properties.arXiv,
                        influentialCitaitonCount: referred[j].properties.influentialCitaitonCount.low,
                        journalVolume: referred[j].properties.journalVolume,
                        isOpenAccess: referred[j].properties.isOpenAccess,
                        pubMedCentral: referred[j].properties.pubMedCentral,
                        publicationDate: referred[j].properties.publicationDate,
                        doi: referred[j].properties.doi,
                    },
                    position: { x: 0, y: 0 },
                };
                nodes.push(node);
            }

            //push edges
            for (let i = 0; i < relations.length; i++) {
                var field = relations[i];
                edge = {
                    data: {
                        source: String(field.start.low),
                        target: String(field.end.low),
                        label: field.type,
                    },
                };
                edges.push(edge);
            }
            return { nodes: nodes, edges: edges };
        } else {
            return { nodes: [], edges: [] };
        }
    },
    getPapersOfAuthor: async function(id) {
        let query = basicQueries.getPapersOfAuthor(id);
        var queryData = {};
        var data = { query: query, queryData: queryData };
        let resp = await dbService.runQuery(data);
        console.log("resp", resp);

        //Process the data
        if (resp.records.length > 0) {
            var nodes = [];
            var edges = [];
            var authorFields = resp.records[0]._fields[0][0];
            var papers = resp.records[0]._fields[1];
            var authorRelations = resp.records[0]._fields[2];
            var referenceRelations = resp.records[0]._fields[3];
            // return authorRelations;

            //Adding author
            var node = {
                data: {
                    type: "Author",
                    label: authorFields.properties.name,
                    authorId: authorFields.properties.authorId,
                    id: String(authorFields.identity.low),
                    url: authorFields.properties.url,
                    citationCount: authorFields.properties.citationCount.low,
                    aliases: authorFields.properties.aliases,
                    paperCount: authorFields.properties.paperCount.low,
                    orhids: authorFields.properties.orhids,
                    affiliations: authorFields.properties.affiliations,
                    homepage: authorFields.properties.homepage,
                    hindex: authorFields.properties.hindex.low,
                },
                position: { x: 0, y: 0 },
            };
            nodes.push(node);

            //Adding papers
            for (let j = 0; j < papers.length; j++) {
                var node = {
                    data: {
                        type: "Paper",
                        label: papers[j].properties.title,
                        id: String(papers[j].identity.low),
                        paperId: papers[j].properties.paperId.low,
                        url: papers[j].properties.url,
                        citationCount: papers[j].properties.citationCount.low,
                        venue: papers[j].properties.venue,
                        journalName: papers[j].properties.journalName,
                        uniqueFieldsOfStudies: papers[j].properties.uniqueFieldsOfStudies,
                        year: papers[j].properties.year.low,
                        publicationTypes: papers[j].properties.publicationTypes,
                        acl: papers[j].properties.acl,
                        dblp: papers[j].properties.dblp,
                        journalPages: papers[j].properties.journalPages,
                        mag: papers[j].properties.mag,
                        pubmed: papers[j].properties.pubmed,
                        referenceCount: papers[j].properties.referenceCount.low,
                        arXiv: papers[j].properties.arXiv,
                        influentialCitaitonCount: papers[j].properties.influentialCitaitonCount.low,
                        journalVolume: papers[j].properties.journalVolume,
                        isOpenAccess: papers[j].properties.isOpenAccess,
                        pubMedCentral: papers[j].properties.pubMedCentral,
                        publicationDate: papers[j].properties.publicationDate,
                        doi: papers[j].properties.doi,
                    },
                    position: { x: 0, y: 0 },
                };
                nodes.push(node);
            }

            //Adding author edges
            for (let i = 0; i < authorRelations.length; i++) {
                var field = authorRelations[i];
                edge = {
                    data: {
                        source: String(field.start.low),
                        target: String(field.end.low),
                        label: field.type,
                    },
                };
                edges.push(edge);
            }

            //Adding reference relations
            for (let i = 0; i < referenceRelations.length; i++) {
                var field = referenceRelations[i];
                edge = {
                    data: {
                        source: String(field.start.low),
                        target: String(field.end.low),
                        label: field.type,
                    },
                };
                edges.push(edge);
            }
            return { nodes: nodes, edges: edges };
        } else {
            return { nodes: [], edges: [] };
        }
    },
};
module.exports = dbControllers;