import { Schema, InferSchemaType, model } from 'mongoose'

const sessionSchema = new Schema({
    device: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        trim: true,
        unique: true,
        required: true
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

type Session = InferSchemaType<typeof sessionSchema>

export default model<Session>('Session', sessionSchema)
