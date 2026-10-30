import mongoose from "mongoose";
import config from "./config.js";


const connectDB = async()=>{

      try {
         await mongoose.connect(config.MONGO_URI);
       console.log("Database is connected successfully.")
        
      } catch (error) {
        
        console.log("Database connection failed.")
        console.log(error)

      }


}

export default connectDB