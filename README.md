# GraphQL

## Roteiro

- Introdução
- Criando primeiro servidor GraphQL (Lista de TODOs)
    - Exemplo sem banco
    - Utilizando um banco de dados com o GraphQL (Sequelize)
    - Autenticação (Login)
    - Autorização
    - Otimizações
- Cliente utilizando GraphQL
    - Login
    - Listas de TODOs
    - TODOs
    - Criar uma nova Lista de TODOs
    - Criar um novo TODO
    - Realtime

## Criando primeiro servidor GraphQL
### Exemplo sem banco

```bash
mkdir server
cd server
yarn init --yes
yarn add apollo-server graphql
```

Criar index.js contendo
```js
const { ApolloServer, gql } = require('apollo-server')

// https://graphql.org/learn/schema/
const typeDefs = gql`
    # TODO
`

// https://www.apollographql.com/docs/apollo-server/essentials/data.html
// (root, args, context, info)
const resolvers = {
    // TODO
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
```

Mais: https://www.apollographql.com/docs/apollo-server/essentials/server.html

### Utilizando um banco de dados com o GraphQL

```bash
cd server
yarn add sequelize sequelize-cli sqlite3
yarn sequelize init
```

config/config.json
```json
{
  "development": {
    "storage": "./database.sqlite",
    "dialect": "sqlite"
  }
}
```

Criar model Todo
```bash
yarn sequelize model:generate --name Todo --attributes value:string
```

# Materiais
- https://graphql.org/learn/schema/
- https://www.howtographql.com/
- https://www.youtube.com/watch?v=c35bj1AT3X8
- https://www.youtube.com/watch?v=IvsANO0qZEg
- https://www.apollographql.com/docs/apollo-server/essentials/server.html
- https://www.apollographql.com/docs/react/
- https://www.graphql.com/articles/4-years-of-graphql-lee-byron