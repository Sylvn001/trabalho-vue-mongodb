import { Request, Response, Router } from "express";
import JokeController from "./controllers/JokeController";
import CategoriesController from "./controllers/CategoriesController";

const router = Router();

const jokeController = new JokeController();
const categoriesController = new CategoriesController();

router.get("/", (request: Request, response : Response) => {
  response.send("Rotas: Criar /jokes/create   Filtrar - /jokes/filter")
})

router.get("/jokes/:filter?", jokeController.findAll)
router.post("/jokes/create?", jokeController.create)

router.get("/categories/:filter?", categoriesController.findAll)

export {router}