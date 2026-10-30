
import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./app/config/config.js";
import Product from '../src/app/models/product.model.js'

dotenv.config();

const products = [
  {
    title: "Wireless Mouse",
    description: "Wireless mouse with USB receiver",
    price: {
      amount: 599,
      currency: "INR"
    }
  },
  {
    title: "Mechanical Keyboard",
    description: "Mechanical keyboard for programming",
    price: {
      amount: 2499,
      currency: "INR"
    }
  },
  {
    title: "Headphones",
    description: "Over-ear headphones with clear sound",
    price: {
      amount: 1499,
      currency: "INR"
    }
  },
  {
    title: "USB-C Cable",
    description: "Fast charging USB-C cable",
    price: {
      amount: 299,
      currency: "INR"
    }
  },
  {
    title: "Laptop Stand",
    description: "Adjustable stand for laptops",
    price: {
      amount: 999,
      currency: "INR"
    }
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");

    await Product.insertMany(products);

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
