# Gerenciador de Projetos

Aplicação em Node.js para organizar projetos de trabalho e projetos escolares. Os dados são mantidos em um arquivo JSON e podem ser manipulados pela interface de terminal ou pela API REST.

## Funcionalidades

- criar projetos de trabalho ou escolares;
- cadastrar líderes e integrantes;
- criar e concluir tarefas;
- atribuir responsáveis às tarefas;
- listar projetos, integrantes e tarefas;
- atualizar dados dos projetos;
- excluir projetos, integrantes e tarefas.

## Estrutura

```text
.
├── src/
│   ├── domain/
│   │   ├── Pessoa.js
│   │   ├── Projeto.js
│   │   ├── ProjetoEscolar.js
│   │   ├── ProjetoTrabalho.js
│   │   ├── ProjetoFactory.js
│   │   └── Tarefa.js
│   ├── storage/
│   │   └── armazenamento.js
│   ├── routes/
│   │   ├── index.js
│   │   └── projetos.js
│   ├── middlewares/
│   │   └── index.js
│   ├── app.js
│   ├── cli.js
│   └── server.js
├── .gitignore
├── package.json
└── package-lock.json
```

## Organização do código

### `src/domain`

Contém as classes responsáveis pelas regras do projeto:

- `Pessoa.js` representa pessoas e suas funções;
- `Projeto.js` implementa os comportamentos comuns de um projeto;
- `ProjetoEscolar.js` especializa projetos escolares;
- `ProjetoTrabalho.js` especializa projetos de trabalho;
- `ProjetoFactory.js` cria e reconstrói projetos;
- `Tarefa.js` representa título, situação e responsável da tarefa.

### `src/storage`

Contém `armazenamento.js`, responsável pela leitura e gravação dos dados em `projetos.json`.

### `src/routes`

Contém os routers do Express:

- `index.js` reúne os recursos da API;
- `projetos.js` implementa as operações de projetos, integrantes e tarefas.

### `src/middlewares`

Contém `index.js`, responsável pelas validações das requisições, pela criação dos erros HTTP e pelo tratamento de rotas inexistentes.

### Arquivos principais

- `app.js` configura a aplicação Express;
- `server.js` inicia o servidor na porta `3000`;
- `cli.js` controla o menu da interface de terminal.

## Orientação a Objetos

O projeto utiliza:

- encapsulamento por meio de campos privados e getters;
- herança com `ProjetoEscolar` e `ProjetoTrabalho`;
- polimorfismo no método `apresentarProjeto`;
- composição entre projeto, integrantes e tarefas;
- Factory por meio de `ProjetoFactory`;
- validações em setters e regras das classes.

## Instalação

```bash
npm install
```

## Execução

Interface de linha de comando:

```bash
npm start
```

Interface de linha de comando em modo watch:

```bash
npm run dev
```

API REST:

```bash
npm run api
```

API REST em modo watch:

```bash
npm run api:dev
```

A API utiliza `http://localhost:3000`.

## API REST

Todas as rotas são iniciadas pelo prefixo `/api`.

### Projetos

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api` | Identifica a API |
| `GET` | `/api/projetos` | Lista projetos |
| `GET` | `/api/projetos?tipo=trabalho` | Filtra projetos por tipo |
| `GET` | `/api/projetos/:id` | Busca um projeto |
| `POST` | `/api/projetos` | Cria um projeto |
| `PUT` | `/api/projetos/:id` | Atualiza nome ou situação |
| `DELETE` | `/api/projetos/:id` | Remove um projeto |

### Integrantes

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/projetos/:id/integrantes` | Lista integrantes |
| `POST` | `/api/projetos/:id/integrantes` | Adiciona um integrante |
| `DELETE` | `/api/projetos/:id/integrantes/:nome` | Remove um integrante |

### Tarefas

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/projetos/:id/tarefas` | Lista tarefas |
| `POST` | `/api/projetos/:id/tarefas` | Adiciona uma tarefa |
| `PUT` | `/api/projetos/:id/tarefas/:numero/atribuir` | Atribui um responsável |
| `PUT` | `/api/projetos/:id/tarefas/:numero/concluir` | Conclui uma tarefa |
| `DELETE` | `/api/projetos/:id/tarefas/:numero` | Remove uma tarefa |

## CRUD

- **Create:** criação de projetos, integrantes e tarefas;
- **Read:** consulta de projetos, integrantes e tarefas;
- **Update:** alteração de projetos, atribuição de responsáveis e conclusão de tarefas;
- **Delete:** exclusão de projetos, integrantes e tarefas.

Ao remover um integrante, as tarefas atribuídas a ele ficam sem responsável.

## Persistência

Os dados são gravados em `projetos.json` por `src/storage/armazenamento.js`.

A persistência utiliza `fs/promises`, `readFile`, `writeFile` e `unlink`. O arquivo JSON é criado na primeira operação de salvamento e pode ser removido pela função de limpeza.

## Respostas HTTP

- `200`: operação realizada com sucesso;
- `201`: recurso criado;
- `400`: dados enviados inválidos;
- `404`: recurso não encontrado;
- `500`: erro interno.
