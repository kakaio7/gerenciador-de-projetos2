const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_PROJETOS || "projetos.json"

async function listar() {
    try {
        const conteudo = await fs.readFile(ARQUIVO, "utf-8")
        return JSON.parse(conteudo)
    } catch (erro) {
        // Só o arquivo que ainda não existe vira lista vazia.
        // Qualquer outro erro (ex.: JSON quebrado) sobe, para não apagarmos dados por engano.
        if (erro.code === "ENOENT") {
            return []
        }

        throw erro
    }
}

async function gravar(projetos) {
    await fs.writeFile(ARQUIVO, JSON.stringify(projetos, null, 2))
}

async function buscarPorId(id) {
    const projetos = await listar()
    const projeto = projetos.find(p => p.id === id)

    if (!projeto) {
        return null
    }

    return projeto
}

async function salvar(projeto) {
    const projetos = await listar()

    let id = 1

    if (projetos.length > 0) {
        id = projetos[projetos.length - 1].id + 1
    }

    const novo = { ...projeto, id }

    projetos.push(novo)
    await gravar(projetos)

    return novo
}

async function atualizar(id, dados) {
    const projetos = await listar()
    const indice = projetos.findIndex(p => p.id === id)

    if (indice === -1) {
        return null
    }

    projetos[indice] = { ...projetos[indice], ...dados, id }
    await gravar(projetos)

    return projetos[indice]
}

async function remover(id) {
    const projetos = await listar()
    const restantes = projetos.filter(p => p.id !== id)

    if (restantes.length === projetos.length) {
        return false
    }

    await gravar(restantes)
    return true
}

async function limpar() {
    try {
        await fs.unlink(ARQUIVO)
        return true
    } catch (erro) {
        return false
    }
}

module.exports = { listar, buscarPorId, salvar, atualizar, remover, limpar }
