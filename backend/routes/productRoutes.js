import express from 'express';
import {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
    getTopProducts
} from '../controllers/productController.js';
import {
    protect,
    admin,
} from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/top')
    .get(getTopProducts);

router.route('/:id/reviews')
    .post(protect, createProductReview);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);



export default router;