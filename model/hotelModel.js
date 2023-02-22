import mongoose from "mongoose";

export const hotelSchema = new mongoose.Schema({
    hotel: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    category: {
        type: String
    },
    description: {
        type: String,
    },
    images: [],
},
    {
        timestamps: true

    })


export default mongoose.model('hotels', hotelSchema);