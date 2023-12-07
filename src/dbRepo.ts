
import domain from './models/index.model'

interface QueryObject {
    query: object,
    data: object,
    options?: object
}

class DbRepo {
    public static findOne(collectionName: string, queryObject: QueryObject): Promise<object> {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .findOne(queryObject.query as any, queryObject.data as any)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: object) => {
                    reject(error)
                })
        })
    }

    public static create(collectionName: string, queryObject: Omit<QueryObject, 'query' | 'options'>) {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .create(queryObject.data)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: object) => {
                    reject(error)
                })
        })
    }

    public static updateOne(collectionName: string, queryObject: QueryObject) {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .updateOne(queryObject.query, queryObject.data, queryObject.options)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: object) => {
                    reject(error)
                })
        })
    }

    public static deleteOne(collectionName: string, queryObject: Pick<QueryObject, 'query'>) {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .deleteOne(queryObject.query)
                .then((results: object) => {
                    resolve(results)
                })
                .catch((error: object) => {
                    reject(error)
                })
        })
    }

    public static find(collectionName: string, queryObject: QueryObject, sortQuery: object = {}) {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .find(queryObject.query, queryObject.data)
                .sort(sortQuery)
                .then((results: object[]) => {
                    resolve(results)
                })
                .catch((error: object) => {
                    reject(error)
                })
        })
    }

    public static findPage(collectionName: string, queryObject: QueryObject, sortQuery: object = {}, page: number, limit: number) {
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
                .catch((error: object) => {
                    reject(error)
                })
        })
    }

    public static aggregate(collectionName: string, queryArray: any[]) {
        return new Promise((resolve, reject) => {
            const collection = (domain as Record<string, any>)[collectionName]

            collection
                .aggregate(queryArray)
                .then((results: object[]) => {
                    resolve(results)
                })
                .catch((error: object) => {
                    reject(error)
                })
        })
    }
}

export default DbRepo
