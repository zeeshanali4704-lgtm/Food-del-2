import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;
    const user = await userModel.findById(userId);
    const cartData = user.cartData || {};
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;
    const user = await userModel.findById(userId);
    const cartData = user.cartData || {};
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };