import { Router } from "express";
const router = Router();

import * as controller from '../controllers/adminController.js'
import Auth from '../middleware/auth.js'

// router.route('/authenticate').post(controller.verifyAdmin, (req, res) => res.end());
// router.route('/add-hotel').post(controller.addHotel);

router.route('/admin-login').post(controller.adminLogin);
router.route('/viewhotels').get(controller.getAllHotels);
router.route('/user-management').get(controller.getAllUsers);
router.route('/useraccess').patch(controller.blockUser);

export default router;