const express = require("express")
const rotas = require("./routes")
const { rotaNaoEncontrada, tratarErro } = require("./middlewares")

const app = express()

app.use(express.json())

app.use("/api", rotas)

app.use(rotaNaoEncontrada)
app.use(tratarErro)

module.exports = app
