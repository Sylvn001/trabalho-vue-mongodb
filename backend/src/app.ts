import express from 'express'
import { router } from './routes';
import cors from 'cors';
import {createSeeds} from './database/categorySeed'

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

//createSeeds() //Descomitar para rodar e dps commitar dnv

const app = express()

app.use(cors(options));
app.use(express.json())
app.use(router);

const port = 3000


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

