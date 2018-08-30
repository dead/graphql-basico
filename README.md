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

