import { Router } from "express";
const router = Router();

import * as controller from '../controllers/userController.js'
import Auth from '../middleware/auth.js'

router.route('/register').post(controller.signup);
router.route('/login').post(controller.login);
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());

export default router;