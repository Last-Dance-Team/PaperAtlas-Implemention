/*
Here we have our APIs that can be called from the frontend
*/
var basicQueries = require("../public/js/database/basic-queries");
const dbService = require("../public/js/database/db-service");

var dbControllers = {
  searchByAuthor: async function (author) {
    let query = basicQueries.getAuthorAndPapers(author);
    var queryData = { author: author };
    var data = { query: query, queryData: queryData };

    let resp = await dbService.runQuery(data);
    var nodes = [];
    var edges = [];

    //Process the data
    var arrayOfObjects = resp.records;
    for (let i = 0; i < arrayOfObjects.length; i++) {
      var object = arrayOfObjects[i];
      var fields = object._fields;
      for (let j = 0; j < fields.length; j++) {
        var field = fields[j];
        var node = {};
        var edge = {};
        console.log("field.labels", field.labels);
        console.log("field.type", field.type);
        if (field.labels == "Author") {
          console.log("adding author");
          node = {
            data: {
              type: "Author",
              label: field.properties.name,
              authorId: field.properties.authorId,
              id: field.identity.low,
              url: field.properties.url,
              citationCount: field.properties.citationCount.low,
              aliases: field.properties.aliases,
              paperCount: field.properties.paperCount.low,
              orhids: field.properties.orhids,
              affiliations: field.properties.affiliations,
              homepage: field.properties.homepage,
              hindex: field.properties.hindex.low,
            },
            position: { x: 0, y: 0 },
          };
        } else if (field.labels == "Paper") {
          console.log("adding paper");
          node = {
            data: {
              type: "Paper",
              label: field.properties.title,
              id: field.identity.low,
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
              influentialCitaitonCount:
                field.properties.influentialCitaitonCount,
              journalVolume: field.properties.journalVolume,
              isOpenAccess: field.properties.isOpenAccess,
              pubMedCentral: field.properties.pubMedCentral,
              publicationDate: field.properties.publicationDate,
              doi: field.properties.doi,
            },
            position: { x: 0, y: 0 },
          };
        } else if (field.type == "an-author-of") {
          console.log("adding edge");
          edge = {
            data: {
              source: field.start.low,
              taregt: field.end.low,
              label: "an-author-of",
            },
          };
        }
        if (node.data) {
          nodes.push(node);
        }
        if (edge.data) {
          edges.push(edge);
        }
      }
    }
    console.log("nodes", nodes);
    console.log("edges", edges);

    return { nodes: nodes, edges: edges };
  },
  searchByPaper: function () {},
};
module.exports = dbControllers;
