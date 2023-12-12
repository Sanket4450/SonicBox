import { Schema, InferSchemaType, model } from 'mongoose'

const categorySchema = new Schema({
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
    parent_categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
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

type Category = InferSchemaType<typeof categorySchema>

export default model<Category>('Category', categorySchema)
