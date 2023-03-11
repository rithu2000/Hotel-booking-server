import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import adminModel from "../model/adminModel.js";
import userModel from "../model/userModel.js";
import hotelModel from "../model/hotelModel.js";
import roomModel from "../model/roomModel.js";
import bookingModel from '../model/bookingModel.js';

export async function verifyAdmin(req, res, next) {

    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        const exist = await adminModel.findOne({ email })
        if (!exist) return res.status(200).send({ error: 'Cant find Admin...!' });
        next();

    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: 'Authentication Error' });
    }
}

export async function getAllUsers(req, res, next) {

    try {
        const Users = await userModel.find({})

        return res.send(Users);
    } catch (error) {
        return res.status(200).send({ error: 'Users not found' });
    }
};

export async function blockUser(req, res, next) {

    const { status, userId } = req.params;
    try {
        const userData = await userModel.updateOne(
            { _id: userId },
            {
                $set: {
                    access: status,
                },
            }
        )
        res.status(200).json({ status: true, userData });
    } catch (error) {
        return res.status(200).send({ error: "Block action failed" })
    }
}

export async function adminLogin(req, res) {

    const { email, password } = req.body;
    try {
        adminModel.findOne({ email })
            .then(admin => {
                bcrypt.compare(password, admin.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(200).send({ error: 'Dont have a Password' });

                        const token = jwt.sign({
                            adminId: admin._id,
                            email: admin.email
                        }, ENV.JWT_SECRET, { expiresIn: '24hr' });

                        return res.status(200).send({
                            msg: 'Login Succesfull...!',
                            email: admin.email,
                            status: true,
                            token
                        });
                    })
                    .catch(error => {
                        return res.status(200).send({ error: 'Password does not match' })
                    })
            })
            .catch(error => {
                return res.status(200).send({ error: 'User not found' });
            })
    } catch (error) {
        return res.status.send({ error });
    }

}

export async function addingHotel(req, res) {

    try {
        const exist = await hotelModel.findOne({ hotel: req.body.hotel })

        if (exist) return res.status(200).send({ error: "Hotel already exists", success: false });

        if (!exist) {
            const newhotel = new hotelModel(req.body)
            await newhotel.save()
            res.status(200).send({ message: "New hotel added succesfully" })
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({ error: 'Something went wrong while adding hotel' })
    }
}

export async function getAllHotels(req, res, next) {

    try {
        const hotels = await hotelModel.find({})

        return res.send(hotels)
    } catch (error) {
        return res.status(200).send({ error: "No hotels found" })
    }

}

export async function addRoom(req, res) {

    const room = req.body
    const hotelId = req.params.Id
    try {
        const exist = roomModel.findOne({ room: req.body.room })

        if (!exist) return res.status(200).send({ error: "Room is already existed" });
        if (exist) {
            const newRoom = new roomModel(req.body)

            await newRoom.save()
            await hotelModel.findByIdAndUpdate(hotelId, {
                $push: { rooms: newRoom._id },
            });
            res.send({ message: "new Room added succesfully" })

        } else {
            return res.status(200).send({ error: "Something went wrong" });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
}

export async function hotelById(req, res) {

    const hotelId = req.params.hotelId
    try {
        const data = await hotelModel.findOne({ _id: hotelId })

        return res.send(data)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteHotel(req, res) {

    try {
        const hotelId = req.params.hotelId

        await hotelModel.deleteOne({ _id: hotelId })
        return res.send({ status: true, success: 'Hotel has been deleted successfully' })
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

export async function deleteRoom(req, res) {

    try {
        const roomId = req.params.roomId

        await roomModel.deleteOne({ _id: roomId })
        return res.send({ status: true })
    } catch (error) {
        console.log(error)
        console.log("not deleted")
    }
}

export async function editHotel(req, res) {

    try {
        const editHotel = await hotelModel.findById(req.params.id,
            {
                $set: req.body
            }
        )

        return res.status(200).send(editHotel)
    } catch (error) {
        return res.status(500).json(error)

    }
}
export async function getAllRoom(req, res) {

    try {
        const Rooms = await roomModel.find({})

        return res.send(Rooms)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
}


export const updateHotel = async (req, res) => {

    const { id, hotel, location, description, category, imageUrl } = req.body

    try {
        const result = await hotelModel
            .updateMany(
                { _id: id },
                {
                    $set: {
                        hotel,
                        location,
                        description,
                        category,
                        imageUrls: imageUrl,
                    },
                }
            )
        console.log(result);
        res.status(200).json({ status: true, result });

    } catch (error) {
        console.log(error);
    }

};

export const changeBookingStatus = async (req, res) => {

    const { status, userId } = req.params;

    try {
        const result = await bookingModel
            .updateOne(
                { _id: userId },
                {
                    $set: {
                        status: status,
                    },
                }
            )

        res.status(200).json({ status: true, result });
    } catch (error) {
        console.log(error);
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const data = await bookingModel.find({})
        console.log(data, 'ALL HOTELS')
        res.send(data)
    } catch (error) {
        console.log(error)
    }

}

export const getUserChart = async (req, res) => {

    try {
        const result = await bookingModel.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$createdAt' },
                    },
                    bookings: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const months = result.map(booking => booking._id);
        const booking = result.map(booking => booking.bookings);;

        // console.log(months);
        // console.log(booking);

        res.json({ months, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const revenueChart = async (req, res) => {

    try {
        const bookings = await bookingModel.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$createdAt' },
                    },
                    revenue: {
                        $sum: '$total',
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        const months = bookings.map(booking => booking._id);
        const revenue = bookings.map(booking => booking.revenue);

        res.json({ months, revenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getBookedRoom = async (req, res) => {

    const Id = req.params.Id

    try {
        const data = await bookingModel.find({ roomId: Id }).populate("roomId")

        res.send(data)
    } catch (error) {
        console.log(error)
    }
}