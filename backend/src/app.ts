import express from 'express'
import { router } from './routes';
const cors  = require('cors');
import {createSeeds} from './database/categorySeed'

//createSeeds() //Descomitar para rodar e dps commitar dnv

const app = express()

app.use(cors());
app.use(express.json())
app.use(router);

const port = 3000


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

