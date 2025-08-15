import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    validatedEmail: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String    
    },
    role: {
        type: [String],
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    }

});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, { _id, __v, password, ...rest }, options) {
        return { id: _id, ...rest };
    }
})


export const User = mongoose.model('User', userSchema);