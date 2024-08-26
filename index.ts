import 'dotenv/config'

import express from 'express'
import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import { URLSchema } from './schema'

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const MONGO_PASSWORD = process.env.MONGO_PASSWORD ?? ''
const MONGO_USER = process.env.MONGO_USER ?? ''

mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@short-url-cluster.gcp679t.mongodb.net/?retryWrites=true&w=majority&appName=short-url-cluster`,
  )
  .then(() => console.log('Connected with MongoDB!'))

const URL = mongoose.model('URL', URLSchema)

const shortID = nanoid()

app.post('/url', async (req, res) => {
  const { url } = req.body

  const data = {
    shortURL: shortID,
    redirectedURL: url,
  }

  await URL.create(data)

  return res.send({ short: `https://localhost:3000/${shortID}` })
})

app.get('/:shortURL', async (req, res) => {
  const { shortURL } = req.params

  const data = await URL.findOne({ shortURL })

  if (data) return res.redirect(data.redirectedURL)

  return res.status(400).send({ message: `Can't find URL!` })
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
