import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import 'dotenv/config';

const protect = asyncHandler(async (request, response, next) => {
    let token;

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        try {
            //Since it comes in "Bearer + ' ' + token" format, gotta split
            token = request.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken);

            request.user = await User.findById(decodedToken.userId).select('-password');

            next();
        } catch (error) {
            console.error(error);
            response.status(401);

            throw new Error('Not authorized, invalid token');
        }
    }

    if (!token) {
        response.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (request, response, next) => {
    if (request.user && request.user.isAdmin) {
        next();
    } else {
        response.status(401);
        throw new Error('Not authorized as admin');
    }
};


export {
    protect,
    admin,
};