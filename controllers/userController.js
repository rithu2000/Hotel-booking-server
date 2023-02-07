import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'

export async function verifyUser(req, res, next) {
    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = await userModel.findOne({ email })
        if (!exist) return res.status(404).send({ error: 'Cant find User...!' });
        next();
    } catch (error) {
        return res.status(404).send({ error: 'Authentication Error' });
    }
}


export async function signup(req, res) {
    try {
        console.log(req.body, 'boddy')
        let { firstName, lastName, email, password } = req.body;
        const userExist = await userModel.findOne({ email: email })
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
            console.log(userData);
            res.json(userData)
        }
        res.json({ message: "user already exist" })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}



export async function login(req, res) {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        userModel.findOne({ email })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: 'Dont have a Password' });

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
                        return res.status(400).send({ error: 'Password does not match' })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: 'User not found' });
            })
    } catch (error) {
        return res.status.send({ error });
    }

}