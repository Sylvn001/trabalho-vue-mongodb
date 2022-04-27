const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err : any, db: any) => {
  if (err) throw err;

  //criando o database myveiculodb
  const dbo = db.db("piadas");

  //criando uma coleção de documentos para o databse myveiculodb
  dbo.createCollection("piada", (err : any, res: any) => {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
