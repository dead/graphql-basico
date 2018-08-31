const { ApolloServer, gql, PubSub } = require('apollo-server')
const db = require('./models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const jwt_secret = 'teste_secret'

const pubsub = new PubSub()

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
        todos: [TodoList]
        users: [User]
    }

    type AuthPayload {
        user: User!,
        token: String!
    }

    type Mutation {
        adicionarUser(name: String!, senha: String!): User
        adicionarTodo(listId: Int!, value: String!): Todo
        criarListaTodo(name: String!): TodoList
        removerTodo(id: Int!): Boolean
        login(username: String!, senha: String!): AuthPayload
    }

    type Subscription {
      userAdicionado: User
    }
`

const isAuthenticated = (next) => {
  return (root, args, context, info) => {
    if (context.user) {
      return next(root, args, context, info)
    } else {
      return new Error('Usuário não está autenticado!')
    }
  }
}

const USER_ADDED = 'USER_ADDED'

// https://www.apollographql.com/docs/apollo-server/essentials/data.html
const resolvers = {
  Query: {
    todos: isAuthenticated((root, args, { user }) => db.TodoList.findAll({where: {
      userId: user.id
    }})),
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
        where: { id: id }
      })) > 0
    },
    adicionarUser: async (root, { name, senha }) => {
      const user = await db.User.findOne({where: {name: name}})
      if (user) {
        return new Error('Usuário já criado!')
      }

      const hash = await bcrypt.hash(senha, 8)
      const u = await db.User.create({
        name: name,
        password: hash
      })

      pubsub.publish(USER_ADDED, { userAdicionado: u })
      return u
    },
    criarListaTodo: isAuthenticated((root, { name }, { user }) => {
      return db.TodoList.create({
        name: name,
        userId: user.id
      })
    }),
    login: async (root, { username, senha }) => {
      const user = await db.User.findOne({where: {name: username}})
      if (!user) {
        return new Error('Usuário ou senha inválida!')
      }

      const valid = await bcrypt.compare(senha, user.password)
      if (!valid) {
        return new Error('Usuário ou senha inválida! 1')
      }
      const token = await jwt.sign({userId: user.id}, jwt_secret)
      return {user: user, token: token}
    }
  },
  Subscription: {
    userAdicionado: {
      subscribe: () => pubsub.asyncIterator([USER_ADDED])
    }
  },
  User: {
    lists: async (root) => {
      return db.TodoList.findAll({
        where: {
          userId: root.id
        }
      })
    }
  },
  TodoList: {
    user: async (root) => {
      return db.User.find({
        where: {
          id: root.userId
        }
      })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {}
    }

    let user = null
    const authorization = req.headers.authorization

    if (authorization) {
      const parts = authorization.split(' ')
      if (parts[0] === 'Bearer') {
        try {
          const token = await jwt.verify(parts[1], jwt_secret)
          if (token) {
            user = await db.User.findOne({where: {id: token.userId}})
          }
        } catch (e) {
          //
        }
      }
    }

    return {
      user: user
    }
  }
})

db.sequelize.sync({ force: true }).then(() => {
  server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`)
    console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`)
  })
})
