import { Router } from "express";
const router = Router();

import * as controller from '../controllers/userController.js'
import Auth from '../middleware/auth.js'

router.route('/register').post( controller.signup);

router.route('/login').post(controller.login);

router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());

router.route('/getHotelByCity/:city').get(controller.getHotelByCity);

router.route('/hotelDetails/:Id').get(controller.hotelDetails);

router.route('/RoomDetails/:Id').get(controller.roomDetails);

router.route("/updateDate/:Id").patch(controller.addDate)

router.route("/checkDate/:Id").post(controller.checkDate)

router.route("/bookRoom/:Id").post(controller.bookRoom)

router.route("/hoteldata").get(controller.hotelData)

export default router;