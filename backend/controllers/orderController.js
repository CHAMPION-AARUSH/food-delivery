import dotenv from 'dotenv';
dotenv.config(); // Ensures .env variables are loaded in this file too
import Stripe from "stripe";
import userModel from './../models/userModel.js';
import orderModel from "../models/orderModel.js";

// Log Stripe key to check if it's loaded
console.log("STRIPE_SECRET_KEY from orderController.js:", process.env.STRIPE_SECRET_KEY);

// const stripe = new Stripe("sk_test_51Qb37PAKIWjCt5AE7t9gfRi4bvKbs8dGF92ICH9Qc0T3ID3QK3Tx7tK4enMvcJXI7CMxjmuVaVsCgmfAE2q0sBZN00emgXWX2f");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const PlaceOrder = async (req, res) => {
    
    const frontend_url = "http://localhost:5173";

    try {
        // Use userId from req.user (set by authMiddleware) instead of req.body
        console.log("getting userId")
        const userId = req.user.id;

        // Create a new order
        const newOrder = new orderModel({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        console.log("created newOrder")
        await newOrder.save();//When you save a document using await newOrder.save(), MongoDB responds with the created document (or at least the _id), and Mongoose updates your instance in memory. This avoids the need to query the database again.
        console.log("saved newOrder")
        // Clear the user's cart data
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Prepare line items for Stripe checkout
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100  // Stripe expects amount in the smallest currency unit (e.g., cents)
            },
            quantity: item.quantity
        }));

        // Add delivery charges as a line item
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 200  // Delivery charge in the smallest currency unit (e.g., cents)
            },
            quantity: 1
        });

        // Create a Stripe checkout session
        console.log("creating stripe session")
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Return the Stripe session URL
        console.log("returning stripe session url")
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error in PlaceOrder:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

const verifyOrder = async(req,res)=>{
    const {orderId,success}=req.body;
    try{
        console.log("verifying order")
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"not paid"});
        }

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"error in verifying the order"});
    }
}

const userOrders = async(req, res) => {
    try {
        // Get userId from the decoded JWT token (set by authentication middleware)
        const userId = req.user.id;
        
        // Fetch orders for the authenticated user
        const orders = await orderModel.find({ userId: userId });
        
        // Return orders if found
        if (orders.length > 0) {
            res.json({ success: true, data: orders });
        } else {
            res.json({ success: true, message: 'No orders found for this user', data: [] });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

//listen orders for admin panel
const listOrders = async(req,res)=>{
    try{
        console.log("listing orders for admin panel")
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"error while lsiting orders for admin"})
    }
}

//api for updating order status
const udpateStatus = async(req,res)=>{
    try{
        console.log("updating order status")
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"status updated"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"error in updating order status"})
    }
}

export { PlaceOrder ,verifyOrder,userOrders,listOrders,udpateStatus};
