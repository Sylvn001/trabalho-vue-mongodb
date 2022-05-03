import { connectToDatabase } from "./db";

let categories = [
    { name: "Trocadilhos" },
    { name: "Tiozão" },
    { name: "Piadas de careca" },
    { name: "Gaucho" },
    { name: "Sogra" },
]

export async function createSeeds(){
    const dbCOn = await connectToDatabase();
    dbCOn.collection("categorias").insertMany(categories);
}


