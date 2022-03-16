import express from 'express';
import {
    getUserProfile,
    registerUser,
    authUser,
    updateUserProfile,
    getUsers,
    deleteUser
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

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id')
    .delete(protect, admin, deleteUser);


export default router;