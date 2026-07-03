import dotenv from "dotenv";
dotenv.config();   // ✅ یہ لائن سب سے اوپر ہونی چاہیے

import orderModel from "../models/orderModels.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address, paymentMethod } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod,
    });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (paymentMethod === 'cod') {
      return res.json({ success: true });
    }

    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charge" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("🔥 Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// user Order for frentebd

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.user.id,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

 const verifyOrder = async (req,res)=>{

  const {orderId,success} = req.body;

  try {
    if(success ==="true"){
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true,message:"Paid"})
    } 
    else{
      await orderModel.findOneAndDelete(orderId);
      res.json({success:false,message:"Not Paid"})
    }
  } catch (error) {
    console.log(error);
    res.josn({success:false,message:"Error"})
    
  }
 }
 

//  listing order for admin panal

const listOrders = async(req,res)=>{

  try {
    const orders = await orderModel.find({});
      res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.josn({success:false,message:"Error"})
    
    
  }

}
// Update Order Status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};


export { placeOrder,userOrder ,verifyOrder,listOrders,updateStatus};