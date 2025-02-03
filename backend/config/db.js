import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Aarush:rGesvtoRlcvg0nrh@cluster0.fhwiy.mongodb.net/FOOD_DELIVERY").then(()=>console.log("DB connected"))
}