import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import { ApolloProvider, Query } from 'react-apollo'
import ApolloClient from 'apollo-client'

import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'

import gql from 'graphql-tag'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/'
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

const QUERY_LIST_USERS = gql`
query ListarUsuarios {
  users {
    name
  }
}
`

const USER_SUBSCRIPTION = gql`
  subscription UsuarioAdicionado {
    userAdicionado  {
      name
    }
  }
`

class ListaUsuarios extends Component {
  componentDidMount () {
    this.props.subscribeToNewUsers()
  }

  render () {
    const {error, loading, data} = this.props

    if (error) return <p>Error :(</p>
    if (loading) return <p>Loading...</p>
    if (data.users.length === 0) return <p>Nenhum usuário</p>

    return (
      <ul>
        {data.users.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    )
  }
}

// {({ loading, error, data }) => {
//   console.log(data)
//   if (loading) return <p>Loading...</p>
//   if (error) return <p>Error :(</p>

//   if (data.users.length === 0) return <p>Nenhum usuário</p>

//   return data.users.map(({ name }) => (
//     <li key={name}>{name}</li>
//   ))
// }}

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <div className='App'>
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-title'>Welcome to React</h1>
          </header>
          <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
        <div>
          <ul>
            <Query query={QUERY_LIST_USERS}>
              {({ subscribeToMore, ...result }) => (
                <ListaUsuarios {...result} subscribeToNewUsers={() =>
                  subscribeToMore({
                    document: USER_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data.userAdicionado) return prev

                      const newItem = subscriptionData.data.userAdicionado
                      return Object.assign({}, prev, {
                        users: [newItem, ...prev.users]
                      })
                    }
                  })
                } />
              )}
            </Query>
          </ul>
        </div>
      </ApolloProvider>
    )
  }
}

export default App
