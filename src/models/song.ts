import { Schema, InferSchemaType, model } from 'mongoose'

const songSchema = new Schema({
    artistId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    albumId: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    fileURL: {
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
