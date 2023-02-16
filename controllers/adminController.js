import adminModel from "../model/adminModel.js";
import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import hotelModel from "../model/hotelModel.js";
import authMiddleware from '../middleware/auth.js'
import roomModel from "../model/roomModel.js";

export async function verifyAdmin(req, res, next) {

    try {

        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = await adminModel.findOne({ email })
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
        console.log(Users);

        return res.send(Users);
    } catch (error) {
        return res.status(200).send({ error: 'Users not found' });
    }

}

export async function blockUser(req, res, next) {

    console.log(req.params);

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
    console.log(req.body);
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

export async function addHotel(req, res) {
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

    console.log(req.body, "body Room")
    console.log(req.params, "params Room")
    const room = req.body
    const hotelId = req.params.Id

    try {
        const exist = roomModel.findOne({ room: req.body.room })

        if (exist) return res.status(200).send({ error: "Room is already existed" });
        if (!exist) {
            const newRoom = new roomModel(req.body)
            console.log(newRoom, "newRoom")
            await newRoom.save()

            await hotelSchema.findByIdAndUpdate(hotelId, {
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
    console.log(req.params, "req.body")
    const hotelId = req.params.hotelId
    console.log(hotelId, "kkkkkkkkkkkkkkkkkkkkkkk")
    try {
        const data = await hotelModel.findOne({ _id: hotelId })
        console.log(data, "hooooooooooooooooooootel")
        return res.send(data)
    } catch (error) {
        console.log(error)
    }

}


export async function deleteHotel(req, res) {
    console.log("deleting back")
    // console.log(req.params)
    try {
        const hotelId = req.params.hotelId

        console.log(hotelId)
        await hotelModel.deleteOne({ _id: hotelId })

        res.send({ status: true })
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}
export async function deleteRoom(req, res) {
    console.log("deleting back")
    // console.log(req.params)
    try {
        const roomId = req.params.roomId

        console.log(roomId)
        await roomModel.deleteOne({ _id: roomId })

        return res.send({ status: true })
    } catch (error) {
        console.log(error)
        console.log("not deleted")
    }
}

export async function editHotel(req, res) {
    console.log(req.body);
    try {
        const editHotel = await hotelModel.findById(req.params.id,
            {
                $set: req.body
            }
        )
        res.status(200).json(updateHotel)
    } catch (error) {
        res.status(500).json(error)

    }
}
export async function getAllRoom(req, res) {

    try {
        console.log("object in back")
        const Rooms = await roomModel.find({})
        return res.send(Rooms)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
}


export const updateHotel = async (req, res) => {
    const { id, hotel, location, description, category, imageUrl } = req.body
    console.log(req.params, "ooooooooooooooooooo")
    console.log(hotel, location, description, category, "11111111111111111111111oooo")

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

}

