import domain from './models/index.model'

interface QueryObject {
    query: object,
    data: object,
    options?: object
}

export default class DbRepo {
    public static findOne(collectionName: string, queryObject: QueryObject): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .findOne(queryObject.query as any, queryObject.data as any)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static create(collectionName: string, queryObject: Omit<QueryObject, 'query' | 'options'>): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .create(queryObject.data)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static updateOne(collectionName: string, queryObject: QueryObject): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .updateOne(queryObject.query, queryObject.data, queryObject.options)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static deleteOne(collectionName: string, queryObject: Pick<QueryObject, 'query'>): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .deleteOne(queryObject.query)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static deleteMany(collectionName: string, queryObject: Pick<QueryObject, 'query'>): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .deleteMany(queryObject.query)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static find(collectionName: string, queryObject: QueryObject, sortQuery: object = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .find(queryObject.query, queryObject.data)
                .sort(sortQuery)
                .then((results: object[]) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static findPage(collectionName: string, queryObject: QueryObject, sortQuery: object = {}, page: number, limit: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .find(queryObject.query, queryObject.data)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .then((results: object[]) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }

    public static aggregate(collectionName: string, queryArray: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .aggregate(queryArray)
                .then((results: object[]) => {
                    resolve(results)
                })
                .catch((error: any) => {
                    reject(error)
                })
        })
    }
}
