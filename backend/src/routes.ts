import { Request, Response, Router } from "express";
import JokeController from "./controllers/JokeController";

const router = Router();

const jokeController = new JokeController();

router.get("/", (request: Request, response : Response) => {
  response.send("Rotas: Criar /jokes/create   Filtrar - /jokes/filter")
})

router.get("/jokes/:filter?", jokeController.findAll)
router.post("/jokes/create?", jokeController.create)


export {router}