import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        console.log("Request received:", req.body);

        // Access userId from the decoded token
        const { itemId } = req.body;
        const userId = req.user.id; // Correctly accessing userId from req.user

        if (!userId || !itemId) {
            console.log("Validation failed: Missing userId or itemId");
            return res.status(400).json({ success: false, message: "userId and itemId are required" });
        }
          
        // Use userId from req.user to find the user
        let userData = await userModel.findById(userId);      
        if (!userData) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize cartData if it doesn't exist
        let cartData = userData.cartData || {};
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        // Update the user's cart in the database
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};


const removeFromCart = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log request body for debugging

        const { itemId } = req.body;
        const userId = req.user.id; // Get userId from the decoded token in authMiddleware

        // Validate input
        if (!userId || !itemId) {
            console.log("Validation failed: Missing userId or itemId");
            return res.status(400).json({ success: false, message: "userId and itemId are required" });
        }

        // Fetch user data
        let userData = await userModel.findById(userId);
        if (!userData) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Access and update cartData
        let cartData = userData.cartData || {}; // Initialize cartData if it doesn't exist
        if (cartData[itemId] && cartData[itemId] > 0) {
            cartData[itemId] -= 1; // Decrement quantity
            if (cartData[itemId] === 0) delete cartData[itemId]; // Remove item if quantity is 0
        } else {
            console.log("Item not found in cart or quantity is already zero");
            return res.status(400).json({ success: false, message: "Item not found in cart" });
        }

        // Update user document
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Error removing item from cart" });
    }
};

const getCart = async (req, res) => {
    try {
        console.log("Fetching cart for user:", req.user.id);

        const userId = req.user.id; // Get userId from the decoded token
        if (!userId) {
            console.log("Validation failed: Missing userId");
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        // Fetch user data
        let userData = await userModel.findById(userId);
        if (!userData) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Retrieve cart data
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ success: false, message: "Error fetching cart" });
    }
};


export {addToCart,removeFromCart,getCart}