import { Schema, InferSchemaType, model } from 'mongoose'

const albumSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    artistId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    listens: {
        type: Number,
        default: 0
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }]
},
    {
        timestamps: true,
        autoIndex: false
    })

type Album = InferSchemaType<typeof albumSchema>

export default model<Album>('Album', albumSchema)
