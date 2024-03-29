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

router.route('/updateHotel/:Id').put(controller.updateHotel)

router.route("/updateRoom/:Id").put(controller.updateRoom)

router.route('/getAllBooking').get(controller.getAllBookings)

router.route("/getChart").get(controller.getUserChart)

router.route("/getrevenue").get(controller.revenueChart)

router.route('/getRoomById/:Id').get(controller.getBookedRoom)

router.route('/getBookingTotal').get(controller.getBookingTotal)

router.route('/totalRevenue').get(controller.getTotalRevenue)

router.route('/totalUser').get(controller.totalUser)

export default router;