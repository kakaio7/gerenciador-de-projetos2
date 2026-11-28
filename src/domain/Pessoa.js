class Pessoa {
    #nome

    constructor(nome) {
        this.nome = nome
    }

    get nome() {
        return this.#nome
    }

    set nome(nome) {
        if (typeof nome !== "string" || nome.trim() === "") {
            throw new Error("O nome da pessoa é obrigatório.")
        }

        this.#nome = nome.trim()
    }

    get funcao() {
        return "pessoa"
    }

    apresentar() {
        return `Pessoa: ${this.nome}`
    }

    paraObjeto() {
        return { nome: this.nome, funcao: this.funcao }
    }
}

class Lider extends Pessoa {
    get funcao() {
        return "lider"
    }

    apresentar() {
        return `Líder: ${this.nome}`
    }
}

class Integrante extends Pessoa {
    get funcao() {
        return "integrante"
    }

    apresentar() {
        return `Integrante: ${this.nome}`
    }
}

function criarPessoa(funcao, nome) {
    if (typeof funcao !== "string") {
        return null
    }

    const funcoes = {
        lider: Lider,
        integrante: Integrante
    }
    const chaveFuncao = funcao.trim().toLowerCase()

    if (!Object.prototype.hasOwnProperty.call(funcoes, chaveFuncao)) {
        return null
    }

    const ClassePessoa = funcoes[chaveFuncao]
    return new ClassePessoa(nome)
}

module.exports = {
    Pessoa,
    Lider,
    Integrante,
    criarPessoa
}
