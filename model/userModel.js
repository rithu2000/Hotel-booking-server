import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    mobile: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'Please provide a unique Email'],
        unique: [true, 'Email exists']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    access: {
        type: Boolean
    }
});

export default mongoose.model('user', userSchema);