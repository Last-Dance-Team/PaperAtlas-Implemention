/*
Here we are just creating the Cypher queries
*/

var basicQueries = {
    getAuthorAndPapers: function(author) {
        return `MATCH (a:Author) WHERE a.name CONTAINS "${author}"
            WITH a 
            LIMIT 25  
            MATCH (:Author {authorId: a.authorId})-[r]-(p:Paper) 
            RETURN a,p,r`;
    },
    getPaperAndPapers: function(paper) {
        return `MATCH (p:Paper) WHERE p.title CONTAINS "${paper}"
            WITH p 
            LIMIT 50  
            MATCH (:Paper {paperId: p.paperId})-[r]-(pp:Paper) 
            RETURN p,pp,r`;
    },
};
module.exports = basicQueries;