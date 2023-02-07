import adminModel from "../model/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'

export async function verifyAdmin(req, res, next) {
    try {
        const { email } = req.method == 'GET' ? req.query : req.body;
        let exist = await adminModel.findOne({ email })
        if (!exist) return res.status(404).send({ error: 'Cant find User...!' });
        next();
    } catch (error) {
        return res.status(404).send({ error: 'Authentication Error' });
    }
}


// export async function adminSignup(req, res) {
//     try {
//         console.log(req.body, 'boddy')
//         let { firstName, lastName, email, password } = req.body;
//         const userExist = await userModel.findOne({ email: email })
//         if (!userExist) {
//             password = await bcrypt.hash(password, 10)
//             const user = new userModel({
//                 firstName,
//                 lastName,
//                 email,
//                 password,
//                 access: true
//             });
//             const userData = await user.save()
//             console.log(userData);
//             res.json(userData)
//         }
//         res.json({ message: "user already exist" })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error)
//     }
// }



export async function adminLogin(req, res) {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        adminModel.findOne({ email })
            .then(admin => {
                bcrypt.compare(password, admin.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: 'Dont have a Password' });

                        const token = jwt.sign({
                            adminId: admin._id,
                            email: admin.email
                        }, ENV.JWT_SECRET, { expiresIn: '24hr' });

                        return res.status(200).send({
                            msg: 'Login Succesfull...!',
                            email: admin.email,
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