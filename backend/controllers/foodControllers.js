import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename,
    });

    await food.save();

    res.json({ success: true, message: "Food Added" });

  } catch (error) {
    console.log("🔥 ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// list food
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood };