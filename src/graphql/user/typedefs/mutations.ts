export default `#graphql
    type Mutation {
        createUser(
                username: String!,
                name: String,
                email: String!,
                password: String!
                gender: genderType,
                dateOfBirth: String,
                role: roleType
                state: String,
                country: String,
                profile_picture: String,
                description: String
            ): getUserAndTokens!
    }
`
