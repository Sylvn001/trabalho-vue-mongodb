import { router } from './routes';
import cors from 'cors'
const express = require('express')
const app = express()
app.use(cors)
const port = 8080

app.use(express.json())
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

