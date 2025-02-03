import validator from "validator";
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//login
const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }
        const token = createToken(user._id);
        res.json({success:true,token})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async(req,res)=>{
    const {name,email,password}=req.body;
    
    try{
        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"user already exists"})
        }

        //
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"});
        }
        if (password.length<8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        const salt = await bcrypt.genSalt(10);//random string hai of 10 bits.
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export{loginUser,registerUser}