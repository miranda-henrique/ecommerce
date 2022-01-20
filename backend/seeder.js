import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Products from "./models/productModel.js";
import Orders from "./models/orderModel.js";
import connectDB from "./config/db.js";
import Order from "./models/orderModel.js";
import Product from "./models/productModel.js";

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return {
                ...product,
                user: adminUser,
            }
        })

        await Product.insertMany(sampleProducts);

        console.log("Data imported!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log("Data destroyed!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

//Check if shell command has flag "-d". If so, destroy data. Else, import
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}