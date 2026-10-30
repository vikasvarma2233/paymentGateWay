import mongoose from "mongoose";



const productSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            default:"INR"
        }
    }
})

const productModel = mongoose.model("product", productSchema)

export default productModel