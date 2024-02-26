import express from 'express';
import {getUserController, loginController, signupController} from '../controllers/authController.js';
import auth from '../middlewares/auth.js'
const router = express.Router();

router.post('/register',signupController);
router.post('/login',loginController);
router.get('/user',auth,getUserController);

export default router;

