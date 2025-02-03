import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the path to the `backend` folder
const backendDir = path.resolve(__dirname, '..'); // Parent directory of `routes`// Go one level up

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {   //Where to save files (destination).
        // Correctly resolve the `uploads` directory in the backend folder
        const uploadDir = path.join(backendDir, 'uploads');

        // Ensure the directory exists dynamically  // Call `cb` to tell Multer where to save the file
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {   //How to name them (filename)
        cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
foodRouter.post('/add', upload.single('image'), addFood); //field name is "image".
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
