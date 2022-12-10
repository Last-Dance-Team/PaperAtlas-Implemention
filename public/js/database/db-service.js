var neo4j = require("neo4j-driver");
var dotenv = require("dotenv");
dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4j_DB_URI,
  neo4j.auth.basic(process.env.NEO4j_DB_NAME, process.env.NEO4J_DB_PASSWORD)
);

var dbService = {
  runQuery: async function (data) {
    console.log(process.env.NEO4j_DB_URI);
    var query = data.query;
    var queryData = data.queryData;

    console.log("query data", data);
    var session = driver.session();
    var result = await session.run(query, queryData);
    console.log("result", result);
    session.close();
    return result;
  },
};

module.exports = dbService;
