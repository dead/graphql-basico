const { ApolloServer, gql } = require('apollo-server')
const db = require('./models')

// https://graphql.org/learn/schema/
const typeDefs = gql`
    type Todo {
        id: ID!
        value: String!
        list: TodoList!
    }

    type TodoList {
        id: ID!
        name: String!
        todos: [Todo]
        user: User!
    }

    type User {
        id: ID!
        name: String!
        lists: [TodoList]
    }

    type Query {
        todos: [Todo]
        users: [User]
    }

    type Mutation {
        adicionarUser(name: String!): User
        adicionarTodo(userId: Int!, listId: Int!, value: String!): Todo
        criarListaTodo(userId: Int!, name: String!): TodoList
        removerTodo(id: Int!): Boolean
    }
`

// https://www.apollographql.com/docs/apollo-server/essentials/data.html
const resolvers = {
    Query: {
        todos: () => db.Todo.findAll(),
        users: () => db.User.findAll()
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
        },
        adicionarUser: async (root, { name }) => {
            return await db.User.create({
                name: name
            })
        },
        criarListaTodo: (root, { userId, name }) => {
            return db.TodoList.create({
                name: name,
                userId: userId
            })
        }
    },
    User: {
        lists: async (root) => {
            return await db.TodoList.findAll({
                where: {
                    userId: root.id
                }
            })
        }
    },
    TodoList: {
        user: async (root) => {
            return await db.User.find({
                where: {
                    id: root.userId
                }
            })
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

db.sequelize.sync({force: true}).then(() => {
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`)
    })
})