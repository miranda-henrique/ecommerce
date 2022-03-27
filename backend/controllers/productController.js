import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @description Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (request, response) => {
    const products = await Product.find();

    response.json(products);
});

// @description Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id);

    if (product) {
        response.json(product);
    } else {
        response.status(404);
        throw new Error('Product not found');
    }
});

// @description Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id);

    if (product) {
        await product.remove();

        response.json({
            message: 'Product removed',
        });
    } else {
        response.status(404);
        throw new Error('Product not found');
    }
});

// @description Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (request, response) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: request.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 0,
    });

    const createdProduct = await product.save();

    response.status(201).json(createdProduct);
});

// @description Update product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (request, response) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = request.body;

    const product = await Product.findById(request.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();

        response.json(updatedProduct);
    } else {
        response.status(404);
        throw new Error('Product not found');
    }
});

// @description Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (request, response) => {
    const { rating, comment } = request.body;

    const product = await Product.findById(request.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(review =>
            review.user.toString() === request.user._id.toString());

        console.log(alreadyReviewed);

        if (alreadyReviewed) {
            response.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: request.user.name,
            rating: typeof (rating) === 'number' ? rating : Number(rating),
            comment: comment,
            user: request.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        const totalRating = product.reviews.reduce((accum, currentItem) =>
            currentItem.rating + accum, 0);

        const numOfRatings = product.reviews.length;

        product.rating = totalRating / numOfRatings;

        await product.save();

        response.status(201).json({ message: 'Review added' });
    } else {
        response.status(404);
        throw new Error('Product not found');
    }
});


export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
};