import { connectToDatabase } from "./db";

let categories = [
    { '_id': 1, 'nome': "Trocadilhos 😁" },
    { '_id': 2, 'nome': "Tiozão 🧓" },
    { '_id': 3, 'nome': "Careca 👨‍🦲" },
    { '_id': 4, 'nome': "Gaucho 💁‍♂‍" },
    { '_id': 5, 'nome': "Sogra 👵" },
]

export async function createSeeds(){
    const dbCOn = await connectToDatabase();
    dbCOn.collection("categorias").insertMany(categories);
}


