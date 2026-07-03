

import express from "express";
import { placeOrder,  userOrder,  verifyOrder,listOrders, updateStatus  } from "../controllers/orderControllers.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();  

router.post("/place", authMiddleware, placeOrder);
router.post("/verify",verifyOrder)
router.post("/userorders",authMiddleware,userOrder)
router.get("/list",listOrders)
router.post("/status",updateStatus)



router.post("/hello", (req, res) => {
  res.json({
    success: true,
    message: "Order route working"
  });
});




export default router;  