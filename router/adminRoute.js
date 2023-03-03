import { Router } from "express";
const router = Router();

import * as controller from '../controllers/adminController.js'
import Auth from '../middleware/auth.js'

// router.route('/authenticate').post(controller.verifyAdmin, (req, res) => res.end());


router.route('/admin-login').post(controller.adminLogin);

router.route('/user-management').get(controller.getAllUsers);

router.route('/useraccess/:status/:userId').get(controller.blockUser);

router.route('/addhotel').post(controller.addingHotel);

router.route('/viewhotels').get(controller.getAllHotels);

router.route("/getAllRoom").get(controller.getAllRoom)

router.route("/addRoom/:Id").put(controller.addRoom)

router.route('/deleteHotel/:hotelId').post(controller.deleteHotel)

router.route('/deleteRoom/:roomId').post(controller.deleteRoom)

router.route('/getHotelById/:hotelId').get(controller.hotelById)

router.route('/updateHotel').post(controller.updateHotel)


export default router;
