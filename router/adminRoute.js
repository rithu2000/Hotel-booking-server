import { Router } from "express";
const router = Router();

import * as controller from '../controllers/adminController.js'
import Auth from '../middleware/auth.js'


// router.route('/signup').post(controller.adminSignup);

router.route('/login').post(controller.adminLogin);
router. route('/authenticate').post(controller.verifyAdmin, (req, res) => res.end());

export default router;