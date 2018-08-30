const { ApolloServer, gql } = require('apollo-server')
const db = require('./models')

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
        todos: () => db.Todo.findAll()
    },
    Mutation: {
        adicionarTodo: async (root, args, context, info) => {
            const todo = await db.Todo.create({
                value: args.value
            })

            return todo
        },
        removerTodo: async (root, { id }) => {
            return (await db.Todo.destroy({
                where: {id: id}
            })) > 0
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

db.sequelize.sync().then(() => {
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`)
    })
})