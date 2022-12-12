/*
Here we are just creating the Cypher queries
*/

var basicQueries = {
  getAuthorAndPapers: function (author) {
    return `MATCH (a:Author) WHERE a.name CONTAINS "${author}"
            WITH a 
            LIMIT 25  
            MATCH (:Author {authorId: a.authorId})-[r]-(p:Paper) 
            RETURN a,p,r`;
  },
  getPaperAndPapers: function () {},
};
module.exports = basicQueries;
