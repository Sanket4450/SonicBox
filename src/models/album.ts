import { Schema, InferSchemaType, model } from 'mongoose'

const albumSchema = new Schema({
    artistId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    listens: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

type Album = InferSchemaType<typeof albumSchema>

export default model<Album>('Album', albumSchema)
