import { Schema, InferSchemaType, model } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    name: {
        type: String,
        default: null
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
        enum: ['male', 'female', 'other'],
        default: null
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'artist', 'admin'],
        default: 'user'
    },
    state: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    profile_picture: {
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

type User = InferSchemaType<typeof userSchema>

export default model<User>('User', userSchema)
