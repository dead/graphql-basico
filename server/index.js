const { ApolloServer, gql } = require('apollo-server')

const Todos = [
    {value: 'Fazer apresentação de GraphQL'},
    {value: 'Terminar os chamados antes do fim da sprint'}
]

// https://graphql.org/learn/schema/
const typeDefs = gql`
    type Todo {
        id: ID!
        value: String
    }

    type Query {
        todos: [Todo]
    }

    type Mutation {
        adicionarTodo(value: String!): Todo
        removerTodo(id: Int!): Boolean
    }
`

// https://www.apollographql.com/docs/apollo-server/essentials/data.html
const resolvers = {
    Query: {
        todos: () => Todos.map((t, i) => ({id: i+1, ...t}))
    },
    Mutation: {
        adicionarTodo: (root, args, context, info) => {
            const todo = {value: args.value}
            Todos.push(todo)
            return todo
        },
        removerTodo: (root, { id }) => {
            if (Todos.length <= id) {
                return false
            }

            Todos.splice(id, 1)
            return true
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})