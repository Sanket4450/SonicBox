import { Schema, InferSchemaType, model } from 'mongoose'

const followerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true,
        autoIndex: false
    })

type Follower = InferSchemaType<typeof followerSchema>

export default model<Follower>('Follower', followerSchema)
