import express from 'express';
import {
    getUserProfile,
    registerUser,
    authUser,
    updateUserProfile,
    getUsers
} from '../controllers/userController.js';
import {
    protect,
    admin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getUsers)
    .post(registerUser);

router.post('/login', authUser);

//Route
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);


export default router;