import { Schema, InferSchemaType, model } from 'mongoose'

const songSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        trim: true,
        required: true
    },
    listens: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

type Song = InferSchemaType<typeof songSchema>

export default model<Song>('Song', songSchema)
