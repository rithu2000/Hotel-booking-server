import adminModel from "../model/adminModel.js";
import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import hotelModel from "../model/hotelModel.js";

export async function verifyAdmin(req, res, next) {

    try {

        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = await adminModel.findOne({ email })
        if (!exist) return res.status(404).send({ error: 'Cant find Admin...!' });
        next();

    } catch (error) {
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
    try {
        const userData = userModel.findOne({email})
        if(userData) {
            userData.access =false;
        }
        let userId = req.params.id;
        await userSchema.updateOne({ _id: userId }, {
            $set: {
                access: false
            }
        })
    } catch (error) {
        return res.status(200).send({error: "Block action failed"})
    }
}

export async function getAllHotels(req, res, next) {

    try {

        const hotels = hotelModel.find({})

        return hotels

    } catch (error) {
        return res.status(200).send({ error: "No hotels found" })
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

