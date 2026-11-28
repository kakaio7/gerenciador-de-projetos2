const express = require("express")
const projetosRouter = require("./projetos")

const router = express.Router()

router.get("/", (req, res) => {
    res.json({ mensagem: "API do Gerenciador de Projetos" })
})

router.use("/projetos", projetosRouter)

module.exports = router
