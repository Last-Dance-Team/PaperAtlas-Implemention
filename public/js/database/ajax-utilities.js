var neo4j = require('neo4j-driver');

const driver = neo4j.driver(process.env.NEO4j_DB_URI, neo4j.auth.basic(process.env.NEO4j_DB_NAME, process.env.NEO4J_DB_PASSWORD));

var ajaxUtilities = 
{
    runDatabaseQuery: function (req, res) {
        if(req.method == 'POST') {
            var query = req.body.query;
            var queryData = req.body.queryData;
    
            var session = driver.session();
    
            console.log("query", query)
            session.run( query, queryData)
                .then( (result) => {
                    const singleRecord = result.records
                    console.log(singleRecord)
                  // const node = singleRecord.get(0)
                    // console.log(singleRecord.get(1))
                    res.status(200);
                    res.send(result)
                } )
          .catch((err) => {
                    res.status(500);
                    console.log(err);
                    res.send("Error: " + err);
          })
          .finally(() => {
            session.close()
          });
        }
    }
}

module.exports = ajaxUtilities;