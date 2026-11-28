# Gerenciador de Projetos

Aplicação em JavaScript para organizar projetos, integrantes e tarefas. O sistema oferece uma interface de linha de comando e uma API REST; ambos compartilham as regras de negócio e o armazenamento local em JSON.

## Funcionalidades

- Criar projetos de trabalho e escolares.
- Cadastrar líderes e integrantes.
- Criar tarefas, atribuí-las a integrantes e marcá-las como concluídas.
- Consultar, atualizar e remover projetos pela API.
- Persistir os dados localmente em `projetos.json`.

## Tecnologias

- Node.js (20.6 ou superior recomendado)
- Express 5
- `prompt-sync` para entrada na aplicação de linha de comando
- `fs/promises` para persistência em arquivo

## Instalação

Clone ou baixe o projeto, abra o terminal na pasta que contém `package.json` e instale as dependências:

```bash
npm install
```

## Como executar

### Aplicação de linha de comando

```bash
npm start
```

Durante o desenvolvimento, use o modo watch:

```bash
npm run dev
```

O menu permite criar e abrir projetos, gerenciar integrantes e tarefas, consultar informações e concluir projetos.

### API REST

Inicie o servidor:

```bash
npm run api
```

A API ficará disponível em `http://localhost:3000`. Para desenvolvimento com reinicialização automática:

```bash
npm run api:dev
```

O script `api:dev` carrega as variáveis de um arquivo `.env` e requer Node.js com suporte a `--env-file` (Node.js 20.6 ou superior). Exemplo de configuração:

```env
PORT=3000
ARQUIVO_PROJETOS=projetos.json
```

O arquivo `.env` é ignorado pelo Git. Sem `PORT`, o servidor usa a porta `3000`. Sem `ARQUIVO_PROJETOS`, os dados são gravados em `projetos.json` no diretório de execução.

## Estrutura do projeto

```text
.
├── routes/
│   ├── index.js              # Router principal da API
│   └── projetos.js           # Rotas de projetos, integrantes e tarefas
├── index.js                  # Cria e exporta a aplicação Express
├── servidor.js               # Inicia o servidor HTTP
├── middlewares.js            # Validação de requisições e criação de erros HTTP
├── cli.js                    # Menu da aplicação de linha de comando
├── armazenamento.js          # Leitura e gravação dos dados em JSON
├── Pessoa.js                 # Pessoa, líder e integrante
├── Projeto.js                # Regras comuns dos projetos
├── ProjetoEscolar.js         # Especialização de projeto escolar
├── ProjetoTrabalho.js        # Especialização de projeto de trabalho
├── ProjetoFactory.js         # Criação e reconstrução de projetos
├── Tarefa.js                 # Regras e comportamento das tarefas
├── package.json              # Dependências e scripts npm
└── .gitignore                # Arquivos locais ignorados pelo Git
```

As rotas são agrupadas em `routes/`, as validações ficam em `middlewares.js`, e `servidor.js` é responsável apenas por iniciar o servidor. Esses arquivos ficam na raiz do projeto; não há uma pasta `api/`. A aplicação Express em `index.js` pode ser importada sem abrir uma porta, facilitando seu uso em testes. O menu da aplicação de linha de comando está em `cli.js`.

## API

Todas as rotas começam com `/api`. Envie os corpos das requisições em JSON com o cabeçalho `Content-Type: application/json`.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api` | Retorna uma mensagem de status da API |
| `GET` | `/api/projetos` | Lista projetos; aceita filtro opcional `?tipo=trabalho` ou `?tipo=escolar` |
| `GET` | `/api/projetos/:id` | Busca um projeto pelo identificador |
| `POST` | `/api/projetos` | Cria um projeto |
| `PUT` | `/api/projetos/:id` | Atualiza o nome e/ou a situação do projeto |
| `DELETE` | `/api/projetos/:id` | Remove um projeto |
| `GET` | `/api/projetos/:id/integrantes` | Lista os integrantes de um projeto |
| `POST` | `/api/projetos/:id/integrantes` | Adiciona um integrante |
| `GET` | `/api/projetos/:id/tarefas` | Lista as tarefas de um projeto |
| `POST` | `/api/projetos/:id/tarefas` | Adiciona uma tarefa |
| `PUT` | `/api/projetos/:id/tarefas/:numero/atribuir` | Atribui uma tarefa a um integrante |
| `PUT` | `/api/projetos/:id/tarefas/:numero/concluir` | Conclui uma tarefa |

### Formato dos dados

Criação de projeto:

```json
{
  "nome": "Feira de ciências",
  "tipo": "escolar"
}
```

O campo `tipo` deve ser `trabalho` ou `escolar`.

Adição de integrante:

```json
{
  "nome": "Ana",
  "funcao": "integrante"
}
```

O campo `funcao` deve ser `lider` ou `integrante`.

Adição de tarefa:

```json
{
  "titulo": "Preparar apresentação"
}
```

Atribuição de tarefa:

```json
{
  "responsavel": "Ana"
}
```

Atualização de projeto (envie `nome`, `concluido` ou ambos):

```json
{
  "concluido": true
}
```

O parâmetro `numero` da tarefa começa em `1`. A API responde com JSON; erros seguem o formato `{"erro":"mensagem"}`. Dados inválidos retornam `400`, recursos não encontrados retornam `404` e erros inesperados retornam `500`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia a aplicação de linha de comando |
| `npm run dev` | Inicia a aplicação de linha de comando em modo watch |
| `npm run api` | Inicia a API |
| `npm run api:dev` | Inicia a API em modo watch e carrega `.env` |
| `npm test` | Executa os testes com o runner nativo do Node.js |

> O comando de testes está configurado, mas o projeto ainda não inclui arquivos de teste.
