const { Pessoa } = require("./Pessoa")
const Tarefa = require("./Tarefa")

class Projeto {
    #id
    #nome
    #tipo
    #concluido
    #integrantes
    #tarefas

    constructor(nome, tipo) {
        this.nome = nome
        this.tipo = tipo
        this.#id = null
        this.#concluido = false
        this.#integrantes = []
        this.#tarefas = []
    }

    get id() {
        return this.#id
    }

    set id(id) {
        if (!Number.isInteger(id) || id < 1) {
            throw new Error("O id do projeto deve ser um número inteiro positivo.")
        }

        this.#id = id
    }

    get nome() {
        return this.#nome
    }

    set nome(nome) {
        if (typeof nome !== "string" || nome.trim() === "") {
            throw new Error("O nome do projeto é obrigatório.")
        }

        this.#nome = nome.trim()
    }

    get tipo() {
        return this.#tipo
    }

    set tipo(tipo) {
        if (typeof tipo !== "string" || tipo.trim() === "") {
            throw new Error("O tipo do projeto é obrigatório.")
        }

        this.#tipo = tipo.trim()
    }

    get concluido() {
        return this.#concluido
    }

    set concluido(concluido) {
        if (typeof concluido !== "boolean") {
            throw new Error("A situação do projeto deve ser verdadeira ou falsa.")
        }

        this.#concluido = concluido
    }

    get integrantes() {
        return [...this.#integrantes]
    }

    get tarefas() {
        return [...this.#tarefas]
    }

    adicionarIntegrante(pessoa) {
        if (!(pessoa instanceof Pessoa)) {
            throw new TypeError("O integrante deve ser uma pessoa.")
        }

        this.#integrantes.push(pessoa)

        return `${pessoa.nome} foi adicionado ao projeto.`
    }

    adicionarTarefa(tarefa) {
        if (!(tarefa instanceof Tarefa)) {
            throw new TypeError("A tarefa deve ser uma instância de Tarefa.")
        }

        this.#tarefas.push(tarefa)

        return `Tarefa "${tarefa.titulo}" adicionada ao projeto.`
    }

    atribuirTarefa(numero, nomePessoa) {
        if (!Number.isInteger(numero) || numero < 1) {
            return "Tarefa não encontrada."
        }

        const tarefa = this.#tarefas[numero - 1]

        if (!tarefa) {
            return "Tarefa não encontrada."
        }

        const pessoa = this.#integrantes.find(
            integrante => integrante.nome === nomePessoa
        )

        if (!pessoa) {
            return "Integrante não encontrado."
        }

        tarefa.atribuir(pessoa)

        return `Tarefa atribuída para ${pessoa.nome}.`
    }

    concluirTarefa(numero) {
        if (!Number.isInteger(numero) || numero < 1) {
            return "Tarefa não encontrada."
        }

        const tarefa = this.#tarefas[numero - 1]

        if (!tarefa) {
            return "Tarefa não encontrada."
        }

        tarefa.concluir()

        return `Tarefa "${tarefa.titulo}" concluída.`
    }

    removerIntegrante(nomePessoa) {
        const indice = this.#integrantes.findIndex(
            integrante => integrante.nome === nomePessoa
        )

        if (indice === -1) {
            return "Integrante não encontrado."
        }

        const [integrante] = this.#integrantes.splice(indice, 1)

        this.#tarefas.forEach(tarefa => {
            if (tarefa.responsavel && tarefa.responsavel.nome === integrante.nome) {
                tarefa.removerResponsavel()
            }
        })

        return `Integrante "${integrante.nome}" removido do projeto.`
    }

    removerTarefa(numero) {
        if (!Number.isInteger(numero) || numero < 1) {
            return "Tarefa não encontrada."
        }

        const indice = numero - 1
        const tarefa = this.#tarefas[indice]

        if (!tarefa) {
            return "Tarefa não encontrada."
        }

        this.#tarefas.splice(indice, 1)
        return `Tarefa "${tarefa.titulo}" removida do projeto.`
    }

    listarIntegrantes() {
        if (this.#integrantes.length === 0) {
            return "\nNenhum integrante cadastrado."
        }

        let texto = "\n--- INTEGRANTES ---"

        this.#integrantes.forEach((pessoa, index) => {
            texto += `\n${index + 1} - ${pessoa.apresentar()}`
        })

        return texto
    }

    listarTarefas() {
        if (this.#tarefas.length === 0) {
            return "\nNenhuma tarefa cadastrada."
        }

        let texto = "\n--- TAREFAS ---"

        this.#tarefas.forEach((tarefa, index) => {
            texto += `\n${index + 1} - ${tarefa.apresentar()}`
        })

        return texto
    }

    apresentarProjeto() {
        return `Projeto: ${this.nome} | Tipo: ${this.tipo}`
    }

    paraObjeto() {
        const integrantes = []
        const tarefas = []

        this.#integrantes.forEach(pessoa => {
            integrantes.push(pessoa.paraObjeto())
        })

        this.#tarefas.forEach(tarefa => {
            tarefas.push(tarefa.paraObjeto())
        })

        return {
            id: this.#id,
            nome: this.nome,
            tipo: this.tipo,
            concluido: this.#concluido,
            integrantes: integrantes,
            tarefas: tarefas
        }
    }
}

module.exports = Projeto
