const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const port = process.env.BATTLESHIP_PORT
const battleshipRoutes = require('./routes/battleshipRoutes')

const connectDB = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', battleshipRoutes)

connectDB()

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port: ${port}`)
})
