import mongoose from "mongoose";

export const roomSchema = new mongoose.Schema({
    hotelId: {
        type: String
    },
    room: {
        type: String,
    },
    price: {
        type: Number
    },
    description: {
        type: String,
    },
    bed: {
        type: String,
    },
    laundry: {
        type: String,
    },
    AC: {
        type: String,
    },
    wifi: {
        type: String,
    },
    userId: {
        type: String,
    },
    images: [],

    unavailableRoom: []
},
    {
        timestamps: true

    })
export default mongoose.model('rooms', roomSchema);



