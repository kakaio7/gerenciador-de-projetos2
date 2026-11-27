const ProjetoEscolar = require("./ProjetoEscolar")
const ProjetoTrabalho = require("./ProjetoTrabalho")
const Tarefa = require("./Tarefa")
const { criarPessoa } = require("./Pessoa")

class ProjetoFactory {
    static criarProjeto(tipo, nome) {
        if (typeof tipo !== "string") {
            return null
        }

        const tipos = {
            trabalho: ProjetoTrabalho,
            escolar: ProjetoEscolar
        }
        const chaveTipo = tipo.trim().toLowerCase()

        if (!Object.prototype.hasOwnProperty.call(tipos, chaveTipo)) {
            return null
        }

        const ClasseProjeto = tipos[chaveTipo]
        return new ClasseProjeto(nome)
    }

    // Faz o caminho contrário do paraObjeto(): objeto do arquivo -> instância
    static reconstruir(dados) {
        const projeto = ProjetoFactory.criarProjeto(dados.tipo, dados.nome)

        if (!projeto) {
            return null
        }

        projeto.id = dados.id
        projeto.concluido = dados.concluido === true

        dados.integrantes.forEach(item => {
            projeto.adicionarIntegrante(criarPessoa(item.funcao, item.nome))
        })

        dados.tarefas.forEach(item => {
            const tarefa = new Tarefa(item.titulo)

            if (item.responsavel) {
                const pessoa = projeto.integrantes.find(
                    integrante => integrante.nome === item.responsavel
                )

                if (pessoa) {
                    tarefa.atribuir(pessoa)
                }
            }

            if (item.concluida) {
                tarefa.concluir()
            }

            projeto.adicionarTarefa(tarefa)
        })

        return projeto
    }
}

module.exports = ProjetoFactory
