import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import hotelModel from "../model/hotelModel.js";
import roomModel from "../model/roomModel.js";
import bookingModel from "../model/bookingModel.js";

export async function verifyUser(req, res, next) {
    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        const exist = await userModel.findOne({ email })
        if (!exist) return res.status(200).send({ error: 'Cant find User...!' });
        next();

    } catch (error) {
        return res.status(404).send({ error: 'Authentication Error' });
    }
}

export async function signup(req, res) {
    try {

        const { firstName, lastName, email, password, confirmPassword } = req.body;
        const userExist = await userModel.findOne({ email: email })
        if (password === confirmPassword) {
            if (!userExist) {
                password = await bcrypt.hash(password, 10)
                const user = new userModel({
                    firstName,
                    lastName,
                    email,
                    password,
                    access: true
                });
                const userData = await user.save()
                res.json(userData)
            } else {
                res.json({ message: "User already exist" })
            }
        } else {
            res.json({ message: "Password mismatch" })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error })
    }

}

export async function login(req, res) {

    const { email, password } = req.body;
    try {

        userModel.findOne({ email })
            .then(user => {
                if (user.access == true) {
                    bcrypt.compare(password, user.password)
                        .then(passwordCheck => {
                            if (!passwordCheck) return res.status(200).send({ error: 'Wrong password...!' });

                            const token = jwt.sign({
                                userId: user._id,
                                email: user.email
                            }, ENV.JWT_SECRET, { expiresIn: '24hr' });

                            return res.status(200).send({
                                userId: user._id,
                                msg: 'Login Succesfull...!',
                                email: user.email,
                                token,
                                status: true
                            });
                        })
                        .catch(error => {
                            return res.status(200).send({ error: 'Password does not match' })
                        })
                } else {
                    return res.status(200).send({ error: 'Restricted by the admin' })
                }
            })
            .catch(error => {
                return res.status(200).send({ error: 'User not found' });
            })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error });
    }
}

export async function getHotelByCity(req, res) {

    const city = req.params.city
    try {
        const data = await hotelModel.find({ location: city })

        return res.send(data)
    } catch (error) {
        console.log(error)
    }
}

export async function hotelDetails(req, res) {

    const Id = req.params.Id
    try {
        const data = await hotelModel.findOne({ _id: Id })

        return res.send(data)
    } catch (error) {
        return res.status(500).send('Cannot fetch the Details')
    }
}

export async function hotelData(req, res) {

    try {
        const data = await hotelModel.find({});

        return res.send(data)
    } catch (error) {
        return res.send({ error: "hotel fetch error" })
    }
}

export async function roomDetails(req, res) {

    const hotelId = req.params.Id
    try {
        const data = await roomModel.find({ hotelId: hotelId })

        return res.send(data)
    } catch (error) {
        console.log(error)
    }
}


export async function addDate(req, res) {

    const hotelId = req.params.Id;
    console.log(req.params);
    const dates = req.body;
    console.log(dates, "dates");
    try {
        const data = await roomModel.findOne({ _id: hotelId });
        data.unavailableRoom = [...data.unavailableRoom, ...dates]
        data.save()
        console.log(data, "roooom");
        // console.log(first)

        res.send(data);
    } catch (error) {
        console.log(error);
    }
}

export async function checkDate(req, res) {

    const hotelId = req.params.Id;
    const dates = req.body
    try {
        const data = await roomModel.findOne({ _id: hotelId });

        function compareArrays(arr1, arr2) {
            for (let i = 0; i < arr1.length; i++) {
                if (arr2.includes(arr1[i])) {
                    return false;
                }
            }
            return true;
        }
        const status = compareArrays(data.unavailableRoom, dates)

        res.send(status);
    } catch (error) {
        console.log(error);
    }
}

export async function bookRoom(req, res) {

    const room = req.body
    const dates = req.body.UA
    const hotelId = req.params.Id
    try {
        const data = await roomModel.findOne({ _id: hotelId });
        data.unavailableRoom = [...data.unavailableRoom, ...dates]
        data.save()
        const newBook = await new bookingModel(req.body)
        await newBook.save()
        res.send({ message: "Booked Succesfully" })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
};

export const getMyBookings = async (req, res) => {
    try {
        console.log(req.params, "ID ")
        const Id = req.params.Id
        console.log(Id, "IDDDDDDD")
        const data = await bookingModel.find({ userId: Id }).populate("roomId")
        console.log(data, "2222222222222222222222")
        return res.send(data)
    } catch (error) {
        console.log(error)
    }   
};

export async function getUserDetails(req, res) {
    try {
        const {userId} = req.params
        console.log(req.params);
        const data = await userModel.findById(userId)
        console.log(data, "the user kjhjkhkjhkhkjhkjhjkhjkhjklh");
        return res.send(data)
    } catch (error) {
        return res.status(404).send({ error});
    }
}