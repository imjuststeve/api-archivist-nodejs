import {ApolloServer, gql} from 'apollo-server'
import * as fs from 'fs-extra'
//import { inspect } from 'util'

async function init() {
  const rootSchema = await fs.readFile(__dirname + '/root.graphql')

  var accountFromAddress = (parent, args, context, info) => {
    return {
        address: args.address,
        nodes: nodesFromAccount(args.address)
    }
  }

  var nodeFromAddress = (parent, args, context, info) => {
    return {
        type: 'node',
        address: args.address
    }
  }

  var nodesFromAccount = (account) => {
    return [
      {
        type: 'node',
        address: '0x1'
      },
      {
        type: 'node',
        address: '0x2'
      }
    ]
  }

  let typeDefs = gql(rootSchema.toString())

  let resolvers = {
    Query: {
      account(root, args, context, info) {
        return accountFromAddress(root, args, context, info)
      },
      node(root, args, context, info) {
        return nodeFromAddress(root, args, context, info)
      },
      nodes(account) {
        return nodesFromAccount(account)
      }
    }
  }

  let server = new ApolloServer( {typeDefs, resolvers} )

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

try {
  init()
}
catch(error) {
  console.error(error)
}
