import { Request, Response } from "express";
import { connectToDatabase } from "../database/db";

export default class JokeController {
  async findAll(request: Request, response: Response) {
    const dbCOn = await connectToDatabase();
    const filter = request.params.filter;
    const query = filter ? { nome: filter } : {};
    const data = await dbCOn.collection("categorias").find(query).toArray();
    response.status(200).json(data);
  }


}
