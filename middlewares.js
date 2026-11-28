function criarErro(status, mensagem) {
    const erro = new Error(mensagem)
    erro.status = status
    return erro
}

function textoValido(valor) {
    return typeof valor === "string" && valor.trim() !== ""
}

function validarProjeto(req, res, next) {
    const corpo = req.body || {}

    if (!textoValido(corpo.nome)) {
        return next(criarErro(400, "O campo nome e obrigatorio"))
    }

    if (corpo.tipo !== "trabalho" && corpo.tipo !== "escolar") {
        return next(criarErro(400, "O campo tipo deve ser trabalho ou escolar"))
    }

    next()
}

function validarAtualizacao(req, res, next) {
    const corpo = req.body || {}

    if (corpo.nome === undefined && corpo.concluido === undefined) {
        return next(criarErro(400, "Envie o campo nome ou o campo concluido"))
    }

    if (corpo.nome !== undefined && !textoValido(corpo.nome)) {
        return next(criarErro(400, "O campo nome deve ser um texto"))
    }

    if (corpo.concluido !== undefined && typeof corpo.concluido !== "boolean") {
        return next(criarErro(400, "O campo concluido deve ser true ou false"))
    }

    next()
}

function validarIntegrante(req, res, next) {
    const corpo = req.body || {}

    if (!textoValido(corpo.nome)) {
        return next(criarErro(400, "O campo nome e obrigatorio"))
    }

    if (corpo.funcao !== "lider" && corpo.funcao !== "integrante") {
        return next(criarErro(400, "O campo funcao deve ser lider ou integrante"))
    }

    next()
}

function validarTarefa(req, res, next) {
    const corpo = req.body || {}

    if (!textoValido(corpo.titulo)) {
        return next(criarErro(400, "O campo titulo e obrigatorio"))
    }

    next()
}

function validarAtribuicao(req, res, next) {
    const corpo = req.body || {}

    if (!textoValido(corpo.responsavel)) {
        return next(criarErro(400, "O campo responsavel e obrigatorio"))
    }

    next()
}

module.exports = {
    criarErro,
    validarProjeto,
    validarAtualizacao,
    validarIntegrante,
    validarTarefa,
    validarAtribuicao
}
