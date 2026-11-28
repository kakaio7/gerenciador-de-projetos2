const express = require("express")

const armazenamento = require("../armazenamento")
const ProjetoFactory = require("../ProjetoFactory")
const Tarefa = require("../Tarefa")
const { criarPessoa } = require("../Pessoa")
const {
    criarErro,
    validarProjeto,
    validarAtualizacao,
    validarIntegrante,
    validarTarefa,
    validarAtribuicao
} = require("../middlewares")

const router = express.Router()

async function obterProjeto(id) {
    const dados = await armazenamento.buscarPorId(id)

    if (!dados) {
        return null
    }

    return ProjetoFactory.reconstruir(dados)
}

async function salvarProjeto(projeto) {
    return armazenamento.atualizar(projeto.id, projeto.paraObjeto())
}

function numeroDeTarefaValido(projeto, numero) {
    return Number.isInteger(numero) && numero >= 1 && numero <= projeto.tarefas.length
}

router.get("/", async (req, res) => {
    const projetos = await armazenamento.listar()
    const tipo = req.query.tipo

    if (!tipo) {
        return res.json(projetos)
    }

    res.json(projetos.filter(p => p.tipo.toLowerCase() === String(tipo).toLowerCase()))
})

router.get("/:id", async (req, res, next) => {
    const projeto = await armazenamento.buscarPorId(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    res.json(projeto)
})

router.post("/", validarProjeto, async (req, res) => {
    const projeto = ProjetoFactory.criarProjeto(req.body.tipo, req.body.nome)
    const salvo = await armazenamento.salvar(projeto.paraObjeto())

    res.status(201).json(salvo)
})

router.put("/:id", validarAtualizacao, async (req, res, next) => {
    const projeto = await obterProjeto(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    if (req.body.nome !== undefined) {
        projeto.nome = req.body.nome
    }

    if (req.body.concluido !== undefined) {
        projeto.concluido = req.body.concluido
    }

    res.json(await salvarProjeto(projeto))
})

router.delete("/:id", async (req, res, next) => {
    const removido = await armazenamento.remover(Number(req.params.id))

    if (!removido) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    res.json({ mensagem: "Projeto removido" })
})

router.get("/:id/integrantes", async (req, res, next) => {
    const projeto = await armazenamento.buscarPorId(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    res.json(projeto.integrantes)
})

router.post("/:id/integrantes", validarIntegrante, async (req, res, next) => {
    const projeto = await obterProjeto(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    const pessoa = criarPessoa(req.body.funcao, req.body.nome)
    const mensagem = projeto.adicionarIntegrante(pessoa)

    await salvarProjeto(projeto)

    res.status(201).json({ mensagem, integrante: pessoa.paraObjeto() })
})

router.get("/:id/tarefas", async (req, res, next) => {
    const projeto = await armazenamento.buscarPorId(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    const tarefas = []

    projeto.tarefas.forEach((tarefa, index) => {
        tarefas.push({ numero: index + 1, ...tarefa })
    })

    res.json(tarefas)
})

router.post("/:id/tarefas", validarTarefa, async (req, res, next) => {
    const projeto = await obterProjeto(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    const mensagem = projeto.adicionarTarefa(new Tarefa(req.body.titulo))

    await salvarProjeto(projeto)

    res.status(201).json({ mensagem, numero: projeto.tarefas.length })
})

router.put("/:id/tarefas/:numero/atribuir", validarAtribuicao, async (req, res, next) => {
    const projeto = await obterProjeto(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    const numero = Number(req.params.numero)

    if (!numeroDeTarefaValido(projeto, numero)) {
        return next(criarErro(404, "Tarefa nao encontrada"))
    }

    const pessoa = projeto.integrantes.find(
        integrante => integrante.nome === req.body.responsavel
    )

    if (!pessoa) {
        return next(criarErro(404, "Integrante nao encontrado"))
    }

    const mensagem = projeto.atribuirTarefa(numero, req.body.responsavel)

    await salvarProjeto(projeto)

    res.json({ mensagem, tarefa: projeto.tarefas[numero - 1].paraObjeto() })
})

router.put("/:id/tarefas/:numero/concluir", async (req, res, next) => {
    const projeto = await obterProjeto(Number(req.params.id))

    if (!projeto) {
        return next(criarErro(404, "Projeto nao encontrado"))
    }

    const numero = Number(req.params.numero)

    if (!numeroDeTarefaValido(projeto, numero)) {
        return next(criarErro(404, "Tarefa nao encontrada"))
    }

    const mensagem = projeto.concluirTarefa(numero)

    await salvarProjeto(projeto)

    res.json({ mensagem, tarefa: projeto.tarefas[numero - 1].paraObjeto() })
})

module.exports = router
