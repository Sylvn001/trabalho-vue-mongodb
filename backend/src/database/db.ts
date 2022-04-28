import * as mongoDB from "mongodb";

export async function connectToDatabase (){

  const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://localhost:27017");

  await client.connect();

  const db: mongoDB.Db = client.db("piadasdb");

  return db
}