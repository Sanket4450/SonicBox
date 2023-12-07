import { Schema, InferSchemaType, model } from 'mongoose'

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    isPrivate: {
        type: Boolean,
        default: false
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

type Playlist = InferSchemaType<typeof playlistSchema>

export default model<Playlist>('Playlist', playlistSchema)