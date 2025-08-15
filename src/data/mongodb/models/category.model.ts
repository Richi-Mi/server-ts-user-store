import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    available: {
        type: Boolean,
        default: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    }

});

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, { _id, __v, ...rest }, options) {
        return { id: _id, ...rest };
    }
})

export const CategoryModel = mongoose.model('Category', categorySchema);