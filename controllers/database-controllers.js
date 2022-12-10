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
    return resp;
  },
  searchByPaper: function () {},
};
module.exports = dbControllers;
