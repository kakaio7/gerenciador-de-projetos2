const prompt = require("prompt-sync")()

const { criarPessoa } = require("./domain/Pessoa")
const Tarefa = require("./domain/Tarefa")
const ProjetoFactory = require("./domain/ProjetoFactory")
const armazenamento = require("./storage/armazenamento")

let projeto = null

function verificarProjeto() {
    if (!projeto) {
        console.log("\nNenhum projeto ativo.")
        return false
    }

    return true
}

async function salvarProjeto() {
    await armazenamento.atualizar(projeto.id, projeto.paraObjeto())
}

async function criarProjeto() {
    const nome = prompt("Digite o nome do projeto: ")

    console.log("\nTipos de projeto:")
    console.log("1 - Trabalho")
    console.log("2 - Projeto escolar")

    const tipo = prompt("Escolha o tipo: ")

    let tipoProjeto

    if (tipo === "1") {
        tipoProjeto = "trabalho"
    } else if (tipo === "2") {
        tipoProjeto = "escolar"
    } else {
        console.log("Tipo de projeto inválido.")
        return
    }

    const novoProjeto = ProjetoFactory.criarProjeto(tipoProjeto, nome)

    if (!novoProjeto) {
        console.log("Não foi possível criar o projeto.")
        return
    }

    const salvo = await armazenamento.salvar(novoProjeto.paraObjeto())
    novoProjeto.id = salvo.id
    projeto = novoProjeto

    console.log("\nProjeto criado com sucesso!")
    console.log(`Nome: ${projeto.nome}`)
    console.log(`Tipo: ${projeto.tipo}`)
}

async function adicionarIntegrante() {
    console.log("\n1 - Líder")
    console.log("2 - Integrante")

    const tipo = prompt("Escolha o tipo: ")
    const nome = prompt("Digite o nome: ")

    let funcao

    if (tipo === "1") {
        funcao = "lider"
    } else if (tipo === "2") {
        funcao = "integrante"
    } else {
        console.log("Tipo inválido.")
        return
    }

    const pessoa = criarPessoa(funcao, nome)

    console.log(projeto.adicionarIntegrante(pessoa))
    await salvarProjeto()
}

async function adicionarTarefa() {
    const titulo = prompt("Digite o título da tarefa: ")
    const tarefa = new Tarefa(titulo)

    console.log(projeto.adicionarTarefa(tarefa))
    await salvarProjeto()
}

async function atribuirTarefa() {
    console.log(projeto.listarTarefas())

    if (projeto.tarefas.length === 0) {
        return
    }

    const numero = Number(prompt("\nDigite o número da tarefa: "))

    console.log(projeto.listarIntegrantes())

    if (projeto.integrantes.length === 0) {
        return
    }

    const nome = prompt("\nDigite o nome do responsável: ")

    console.log(projeto.atribuirTarefa(numero, nome))
    await salvarProjeto()
}

async function concluirTarefa() {
    console.log(projeto.listarTarefas())

    if (projeto.tarefas.length === 0) {
        return
    }

    const numero = Number(prompt("\nDigite o número da tarefa concluída: "))

    console.log(projeto.concluirTarefa(numero))
    await salvarProjeto()
}

async function listarIntegrantes() {
    console.log(projeto.listarIntegrantes())
}

async function listarTarefas() {
    console.log(projeto.listarTarefas())
}

async function concluirProjeto() {
    const nome = projeto.nome

    projeto.concluido = true
    await salvarProjeto()

    projeto = null

    console.log(`\nProjeto "${nome}" concluído com sucesso!`)
}

async function removerProjeto() {
    const nome = projeto.nome
    const removido = await armazenamento.remover(projeto.id)

    if (!removido) {
        console.log("\nProjeto não encontrado.")
        return
    }

    projeto = null
    console.log(`\nProjeto "${nome}" removido com sucesso!`)
}

async function removerIntegrante() {
    console.log(projeto.listarIntegrantes())

    if (projeto.integrantes.length === 0) {
        return
    }

    const nome = prompt("\nDigite o nome do integrante a remover: ")
    console.log(projeto.removerIntegrante(nome))
    await salvarProjeto()
}

async function removerTarefa() {
    console.log(projeto.listarTarefas())

    if (projeto.tarefas.length === 0) {
        return
    }

    const numero = Number(prompt("\nDigite o número da tarefa a remover: "))
    console.log(projeto.removerTarefa(numero))
    await salvarProjeto()
}

async function verQuantidadeProjetos() {
    const projetos = await armazenamento.listar()

    console.log(`\nQuantidade de projetos salvos: ${projetos.length}`)
}

async function mostrarInformacoes() {
    let situacao = "Em andamento"

    if (projeto.concluido) {
        situacao = "Concluído"
    }

    console.log("\n--- INFORMAÇÕES DO PROJETO ---")
    console.log(`Nome: ${projeto.nome}`)
    console.log(`Tipo: ${projeto.tipo}`)
    console.log(`Situação: ${situacao}`)
    console.log(`Integrantes: ${projeto.integrantes.length}`)
    console.log(`Tarefas: ${projeto.tarefas.length}`)
    console.log(projeto.apresentarProjeto())
}

async function abrirProjetoSalvo() {
    const salvos = await armazenamento.listar()

    if (salvos.length === 0) {
        console.log("\nNenhum projeto salvo.")
        return
    }

    console.log("\n--- PROJETOS SALVOS ---")

    salvos.forEach(p => {
        console.log(`${p.id} - ${p.nome} (${p.tipo})`)
    })

    const id = Number(prompt("\nDigite o id do projeto: "))
    const dados = await armazenamento.buscarPorId(id)

    if (!dados) {
        console.log("\nProjeto não encontrado.")
        return
    }

    projeto = ProjetoFactory.reconstruir(dados)

    console.log(`\nProjeto "${projeto.nome}" aberto.`)
}

const opcoes = [
    { codigo: "1", texto: "Adicionar projeto", precisaProjeto: false, executar: criarProjeto },
    { codigo: "2", texto: "Adicionar integrante", precisaProjeto: true, executar: adicionarIntegrante },
    { codigo: "3", texto: "Adicionar tarefa", precisaProjeto: true, executar: adicionarTarefa },
    { codigo: "4", texto: "Atribuir tarefa", precisaProjeto: true, executar: atribuirTarefa },
    { codigo: "5", texto: "Concluir tarefa", precisaProjeto: true, executar: concluirTarefa },
    { codigo: "6", texto: "Listar integrantes", precisaProjeto: true, executar: listarIntegrantes },
    { codigo: "7", texto: "Listar tarefas", precisaProjeto: true, executar: listarTarefas },
    { codigo: "8", texto: "Concluir projeto", precisaProjeto: true, executar: concluirProjeto },
    { codigo: "9", texto: "Ver quantidade de projetos", precisaProjeto: false, executar: verQuantidadeProjetos },
    { codigo: "10", texto: "Informações do projeto", precisaProjeto: true, executar: mostrarInformacoes },
    { codigo: "11", texto: "Abrir projeto salvo", precisaProjeto: false, executar: abrirProjetoSalvo },
    { codigo: "12", texto: "Remover integrante", precisaProjeto: true, executar: removerIntegrante },
    { codigo: "13", texto: "Remover tarefa", precisaProjeto: true, executar: removerTarefa },
    { codigo: "14", texto: "Remover projeto", precisaProjeto: true, executar: removerProjeto }
]

function mostrarMenu() {
    console.log("\n=================================")
    console.log("              MENU")
    console.log("=================================")

    opcoes.forEach(opcao => {
        console.log(`${opcao.codigo} - ${opcao.texto}`)
    })

    console.log("0 - Sair")
}

async function main() {
    console.log("=================================")
    console.log("     GERENCIADOR DE PROJETOS")
    console.log("=================================")

    let codigo = ""

    while (codigo !== "0") {
        mostrarMenu()

        codigo = prompt("\nEscolha uma opção: ")

        if (codigo === "0") {
            break
        }

        const escolhida = opcoes.find(opcao => opcao.codigo === codigo)

        if (!escolhida) {
            console.log("\nOpção inválida.")
            continue
        }

        if (escolhida.precisaProjeto && !verificarProjeto()) {
            continue
        }

        try {
            await escolhida.executar()
        } catch (erro) {
            console.log(`\nErro: ${erro.message}`)
        }
    }

    console.log("\n=================================")
    console.log("      SISTEMA ENCERRADO")
    console.log("=================================")
}

main()
