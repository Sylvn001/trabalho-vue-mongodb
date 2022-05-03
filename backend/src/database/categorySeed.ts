import { connectToDatabase } from "./db";

let categories = [
    { nome: "Trocadilhos" },
    { nome: "Tiozão" },
    { nome: "Piadas de careca" },
    { nome: "Gaucho" },
    { nome: "Sogra" },
]

export async function createSeeds(){
    const dbCOn = await connectToDatabase();
    dbCOn.collection("categorias").insertMany(categories);
}


