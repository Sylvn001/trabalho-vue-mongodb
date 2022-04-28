import { Request, Response } from "express";
import {connectToDatabase} from '../database/db';


export default class JokeController{
  async findAll(request: Request, response: Response){
    const dbCOn = await connectToDatabase();
    const filter = request.params.filter || {}
    const query = {"titulo":filter };
    const data = dbCOn.collection("piadas").find(query);
    response.status(200).json(data)
  }

  async create(request: Request, response: Response){
    const dbCOn = await connectToDatabase();
    const joke = request.body;
    const data = await dbCOn.collection("piadas").insertOne(joke)
    return response.status(200).json(data)
  }

}