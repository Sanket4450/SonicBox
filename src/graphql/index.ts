import { ApolloServer } from '@apollo/server'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import user from './user/index'
import song from './song/index'

const users = [
    {
        username: 'tony1234',
        name: 'Tony Stark',
        email: 'tony_stark@gmail.com',
        gender: 'male',
        // dateOfBirth: 1995-05 - 30T18: 30:05.327Z,
        state: 'CA',
        country: 'USA',
        profile_picture: null,
        description: null,
        isVerified: null,
        followingsCount: 2,
        followersCount: 0,
        userId: '657bda407752fee65d194edd'
    },
{
        username: 'sanket4450',
        name: 'Sanket Talaviya',
        email: 'sanket_talaviya@gmail.com',
        gender: 'male',
        // dateOfBirth: 2006-04 - 24T13: 15:00.000Z,
        state: 'Gujarat',
        country: 'India',
        profile_picture: 'https://picsum.photos/200',
        description: 'the admin of SonicBox',
        isVerified: null,
        followingsCount: 0,
        followersCount: 0,
        userId: '657fe944e7987793757393c7'
    },
{
        username: 'john1234',
        name: 'John Doe',
        email: 'john_doe@gmail.com',
        gender: 'male',
        dateOfBirth: null,
        state: null,
        country: null,
        profile_picture: null,
        description: null,
        isVerified: null,
        followingsCount: 0,
        followersCount: 0,
        userId: '657bd91e7752fee65d194ece'
    },
{
        username: 'bill1234',
        name: 'Bill Gates',
        email: 'bill_gates@gmail.com',
        gender: null,
        dateOfBirth: null,
        state: null,
        country: null,
        profile_picture: null,
        description: null,
        isVerified: null,
        followingsCount: 0,
        followersCount: 0,
        userId: '6582b7fed38fe0379979a580'
    },
{
        username: 'peter123',
        name: 'Peter Woakes',
        email: 'peter_woakes@gmail.com',
        gender: 'male',
        dateOfBirth: null,
        state: null,
        country: null,
        profile_picture: null,
        description: null,
        isVerified: null,
        followingsCount: 0,
        followersCount: 1,
        userId: '657bd9647752fee65d194ed5'
    },
{
        username: 'alan12345',
        name: 'Alan Walker',
        email: 'alan_walker@gmail.com',
        gender: 'male',
        // dateOfBirth: 1998-06 - 24T05: 23:04.673Z,
        state: null,
        country: 'Norway',
        profile_picture: null,
        description: 'Alan Walker is a norweign DJ, music producer.',
        isVerified: null,
        followingsCount: 0,
        followersCount: 1,
        userId: '657bdfcc7752fee65d194ee6'
    }
]

export default async function createGraphQLServer() {
    const gqlserver = new ApolloServer({
        typeDefs: `
            ${user.typeDefs}
            ${song.typeDefs}
        `,
        resolvers: {
            Query: {
                ...user.queryResolvers,
                ...song.queryResolvers
            },
            Mutation: {
                ...user.mutationResolvers,
                ...song.mutationResolvers
            },
            ...user.parentResolvers
        },
        formatError: (formattedError, error) => {
            if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
                
                return {
                    ...formattedError,
                    message: "Your query doesn't match the schema. Try double-checking it!"
                }
            }
            
            return formattedError
        }
    })

    await gqlserver.start()

    return gqlserver
}
