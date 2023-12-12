import { Schema, InferSchemaType, model } from 'mongoose'

const librarySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    playlists: [{
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    }],
    artists: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    albums: [{
        type: Schema.Types.ObjectId,
        ref: 'Album'
    }]
},
    {
        autoIndex: false
    })

type Library = InferSchemaType<typeof librarySchema>

export default model<Library>('Library', librarySchema)
