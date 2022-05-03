import { router } from './routes';
import cors from 'cors'
import {createSeeds} from './database/categorySeed'

createSeeds()

const express = require('express')
const app = express()
app.use(cors)
const port = 3000

app.use(express.json())
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

