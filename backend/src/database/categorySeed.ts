import { connectToDatabase } from "./db";

let categories = [
    { '_id': 1, 'nome': "Trocadilhos π" },
    { '_id': 2, 'nome': "TiozΓ£o π§" },
    { '_id': 3, 'nome': "Careca π¨βπ¦²" },
    { '_id': 4, 'nome': "Gaucho πβββ" },
    { '_id': 5, 'nome': "Sogra π΅" },
]

export async function createSeeds(){
    const dbCOn = await connectToDatabase();
    dbCOn.collection("categorias").insertMany(categories);
}


