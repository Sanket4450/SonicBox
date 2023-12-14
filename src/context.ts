export const setContext = async ({ req }: any): Promise<contextValue> => {
    return {
        token: req.headers?.authorization ? req.headers.authorization.split(' ')[1] : ''
    }
}

interface contextValue {
    token: string
}
