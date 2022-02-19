import express from 'express';
import {
    getUserProfile,
    registerUser,
    authUser,
    updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//POST
router.post('/login', authUser);

//Route
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/')
    .post(registerUser);


export default router;