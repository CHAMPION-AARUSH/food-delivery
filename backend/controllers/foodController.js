import foodModel from "../models/foodModel.js";
import fs from 'fs';

// if (!fs.existsSync('uploads')) {
//     fs.mkdirSync('uploads');
// }

//add food item
const addFood = async(req,resp)=>{
     let image_filename = `${req.file.filename}`; // gets from multer (present in foodRoute)

     const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
     })
     try{
        await food.save();
        resp.json({success:true,message:"food added"})
     }catch(error){
        console.log(error)
        resp.json({success:false,message:"Error"})
     }
}


//all food list
const listFood = async(req,resp)=>{
   try{
      const foods = await foodModel.find({});
      resp.json({success:true,data:foods})
   }catch(error){
      console.log(error);
      resp.json({success:false,message:"error"})
   }
}

//remove food item
const removeFood = async(req,resp)=>{
   try{
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`,()=>{})
      await foodModel.findByIdAndDelete(req.body.id);
      resp.json({success:true,message:"food removed"})
   }catch(error){
      console.log(error);
      resp.json({success:false,message:"error"})
   }
}

export {addFood,listFood,removeFood}