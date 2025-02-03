import dotenv from 'dotenv';  // Load environment variables at the top
dotenv.config();  // Ensure this is called first

import express from "express";
import cors from "cors"; //Cross-Origin Resource Sharing
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from './routes/orderRoute.js';

// Debug line to print environment variables
// console.log("All Environment Variables:", process.env);

const app = express();
const port=process.env.PORT|| 4000;

// Log specific values to verify if they're loaded correctly
console.log("JWT_SECRET from server file:", process.env.JWT_SECRET);
console.log("STRIPE_SECRET_KEY from server file:", process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/food', foodRouter);//app.use() applies middleware to all HTTP methods (GET,POST,etc.) and paths that match the base route specified
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);//app.use Mounts the router (or middleware) at a base path
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, resp) => {
    resp.send("API working");
});

app.listen(port, () => {
    console.log(`server starting on http://localhost:4000`);
});
