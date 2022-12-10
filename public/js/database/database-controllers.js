/*
Here we have our APIs that can be called from the frontend
*/
var basicQueries = require('basic-queries');

var dbControllers = {
    searchByAuthor: function(author)
    {
        let query = basicQueries.getAuthorAndPapers(author)
        var data = { author: author};

        $.ajax({
            type: "post",
            url: "/ajaxUtilities/runDatabaseQuery",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (data) {
              console.log(data);
              },
            error: function (req, status, err) {
              console.error("Error running query", status, err);
            },
          });

    },
    searchByPaper: function()
    {

    }
}
module.exports = dbControllers;