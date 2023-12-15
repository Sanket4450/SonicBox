import { Schema, InferSchemaType, model } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'artist', 'admin'],
        default: 'user'
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    profile_picture: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    session_logins: {
        type: [Date],
        default: []
    },
    follows: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true,
        autoIndex: false
    })

type User = InferSchemaType<typeof userSchema>

export default model<User>('User', userSchema)
