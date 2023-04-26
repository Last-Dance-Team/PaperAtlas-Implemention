/*
Here we are just creating the Cypher queries
*/

var basicQueries = {
    getPapers: function() {
        return `MATCH (n:Paper)
            WHERE ID(n) IN $paperIds 
            OPTIONAL MATCH (n)-[r]->(m:Paper)
            WHERE ID(m) IN $paperIds 
            RETURN n,r;`;
    },
    getAuthors: function() {
        return "MATCH (n:Author) WHERE ID(n) IN $authorIds RETURN n";
    },
    getAuthorAndPapers: function(author) {
        return `MATCH (a:Author) WHERE a.name CONTAINS "${author}"
            OR any(alias IN a.aliases WHERE alias CONTAINS "${author}")
            RETURN a.name, a.aliases, ID(a)`;
    },
    getPaperAndPapers: function(paper, lengthLimit) {
        return (
            "MATCH (p:Paper) WHERE p.title CONTAINS '" +
            paper +
            "'" +
            " RETURN p.title, ID(p) "
        );
    },
    getNeighborOfPaper: function(title, lengthLimit) {
        return (
            "MATCH p=(a:Paper {title: '" +
            title +
            "'})-[r:`a-reference-of`*.." +
            lengthLimit +
            "]->(c:Paper)" +
            " RETURN nodes(p) as pathNodes ,relationships(p)"
        );
    },
    getAuthorsOfPaper: function(id) {
        return (
            "MATCH p=(n:Author)-[r:`an-author-of`]-(m:Paper)" +
            " WHERE ID(m) = " +
            id +
            " RETURN  collect(n) as authors, collect(m) as paper, collect(r) as relation"
        );
    },
    getReferencesOfPaper: function(id) {
        return (
            "MATCH p=(n:Paper)-[r:`a-reference-of`]->(m:Paper)" +
            " WHERE ID(n) = " +
            id +
            " RETURN  collect(n) as references, collect(m) as paper, collect(r) as relation"
        );
    },
    getReferred: function(id) {
        return (
            "MATCH p=(n:Paper)-[r:`a-reference-of`]->(m:Paper)" +
            " WHERE ID(m) = " +
            id +
            " RETURN  collect(n) as references, collect(m) as paper, collect(r) as relation"
        );
    },
    getPapersOfAuthor: function(id) {
        //Need to test this
        return (
            "MATCH (a:Author)-[written:`an-author-of`]->(p:Paper) " +
            "WHERE ID(a) = " +
            id +
            " OPTIONAL MATCH (p)-[refer_rel:`a-reference-of`]->(ref:Paper)<-[:`an-author-of`]-(a)" +
            " RETURN collect(DISTINCT a) AS authors ,collect(DISTINCT p) AS papers , collect(DISTINCT written) AS author_rel , collect(DISTINCT refer_rel) AS referral "
        );
    },
    getAuthorWithPage: function () {
        return `MATCH (n:Author) WHERE n.name CONTAINS $author OR any(alias IN n.aliases WHERE alias CONTAINS $author)
            return n.name, n.aliases, ID(n) 
            ORDER BY n.hindex DESC,n.name
            SKIP toInteger($startNo) LIMIT 10;`;
    },

    getAuthorPageCount: function () {
        return `MATCH (n:Author) WHERE n.name CONTAINS $author OR any(alias IN n.aliases WHERE alias CONTAINS $author)
                with count(n) as totalResult
                return toInteger(CEIL(totalResult/10.0)) as totalPageCount, totalResult;`;
    }
};
module.exports = basicQueries;