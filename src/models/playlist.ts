import { Schema, InferSchemaType, model } from 'mongoose'

const playlistSchema = new Schema({
    userId: {
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
    description: {
        type: String
    },
    isPrivate: {
        type: Boolean,
        default: false
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
