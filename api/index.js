const express = require("express")
const rotas = require("./routes")

const app = express()

app.use(express.json())

app.use("/api", rotas)

// rota nao encontrada
app.use((req, res) => {
    res.status(404).json({ erro: "Rota nao encontrada" })
})

// middleware de erro: sempre o ultimo
app.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({ erro: erro.message })
})

module.exports = app
