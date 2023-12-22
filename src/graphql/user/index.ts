import types from './typedefs/types'
import queries from './typedefs/queries'
import mutations from './typedefs/mutations'
import queryResolvers from './resolvers/queries'
import mutationResolvers from './resolvers/mutations'
import parentResolvers from './resolvers/parents'

export default {
    typeDefs: `${types} ${queries} ${mutations}`,
    queryResolvers,
    mutationResolvers,
    parentResolvers
}
