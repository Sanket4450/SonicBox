import mongoose from 'mongoose'

const DB_URI = process.env.DB_URI as string

export default function connectDB(): void {
    console.log(`Inside connectDB => ${DB_URI}`)

    mongoose.connect(DB_URI)
        .then((data: any) => {
            console.log(`Database connected successfully: ${data.connection.name}`)
        })
        .catch((err: any) => {
            console.error(`Database connection failed: ${err}`)
            process.exit(1)
        })
}
