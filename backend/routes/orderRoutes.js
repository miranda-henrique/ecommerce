import express from 'express';
import {
    addOrderItems,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderToPaid
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getAllOrders)
    .post(protect, addOrderItems);

router.route('/myorders')
    .get(protect, getUserOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);


export default router;
