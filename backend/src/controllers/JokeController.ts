import { Request, Response } from "express";
import { connectToDatabase } from "../database/db";

import CategoriesController from "./CategoriesController";
const categoriesController = new CategoriesController();

export default class JokeController {
  async findAll(request: Request, response: Response) {
    const dbCOn = await connectToDatabase();
    const filter = request.params.filter;
    const query = filter ? { titulo: filter } : {};
    // const data = await dbCOn.collection("piadas").find(query).toArray();
    const data = await dbCOn.collection("piadas").aggregate([{
      $lookup:
      {
        from: 'categorias',
        localField: 'categoriaId',
        foreignField: "_id",
        as: 'categoria'
      }
    }]).toArray();
    response.status(200).json(data);
  }

  async create(request: Request, response: Response) {
    const dbCOn = await connectToDatabase();
    const joke = request.body;
    const data = await dbCOn.collection("piadas").insertOne(joke);
    return response.status(200).json(data);
  }
}
