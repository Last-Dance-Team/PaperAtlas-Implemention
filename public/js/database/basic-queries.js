/*
Here we are just creating the Cypher queries
*/

var basicQueries = {
    getAuthorAndPapers: function()
    {
        return `MATCH (n:Paper) WHERE n.citationCount = 3467 RETURN n`
    },
    getPaperAndPapers: function()
    {

    }
}
module.exports = basicQueries;
