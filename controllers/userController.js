import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'

export async function verifyUser(req, res, next) {
    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = await userModel.findOne({ email })
        if (!exist) return res.status(200).send({ error: 'Cant find User...!' });
        next();

    } catch (error) {
        return res.status(404).send({ error: 'Authentication Error' });
    }
}


export async function signup(req, res) {
    try {

        let { firstName, lastName, email, password, confirmPassword } = req.body;
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
    console.log(req.body);
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