import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


// @description Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id);

    if (user) {
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        response.status(404);

        throw new Error('User not found.');
    }
});


// @description Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (request, response) => {
    const { name, email, password } = request.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        response.status(400);
        throw new Error('User already exists.');
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });

    if (user) {
        response.status(201)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
    } else {
        response.status(400);
        throw new Error('Invalid user data.');
    }
});

// @description Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (request, response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        response.status(401);
        throw new Error('Invalid email or password');
    }
});


// @description Update user profile
// @route PUT /api/user/profile
// @access Private
const updateUserProfile = asyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id);

    if (user) {
        user.name = request.body.name || user.name;
        user.email = request.body.email || user.email;
        if (request.body.password) {
            user.password = request.body.password;
        }

        const updatedUser = await user.save();

        response.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        response.status(404);
        throw new Error('User not found');
    }
});

// @description Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (request, response) => {
    const users = await User.find({});

    console.log(users);

    response.json(users);
});

// @description Delete user
// @route
// @access Private/Admin
const deleteUser = asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);

    if (user) {
        await user.remove();
        response.json({ message: 'User removed' });
    } else {
        response.status(404);
        throw new Error('User not found');
    }
});

// @description Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (request, response) => {
    const user = await User
        .findById(request.params.id)
        .select('-password');

    if (user) {
        response.json(user);
    } else {
        response.status(404);
        throw new Error('User not found');
    }
});

// @description Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);

    if (user) {
        user.name = request.body.name || user.name;
        user.email = request.body.email || user.email;
        user.isAdmin = request.body.isAdmin;

        const updatedUser = await user.save();

        response.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        response.status(404);
        throw new Error('User not found');
    }
});


export {
    getUserProfile,
    registerUser,
    authUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};