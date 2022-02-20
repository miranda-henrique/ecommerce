import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

//Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

//Error handling
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


dotenv.config();
connectDB();
const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
});

app.get("/", (req, res) => {
    res.send("API is running!");
});

//Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

//Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));