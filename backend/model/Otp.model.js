import mongoose from "mongoose";
const otpSchema=new mongoose.Schema({
    otp:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    expireAt:{
        type:Date
    }
},{timestamps:true})

export const Otp=mongoose.model("Otp",otpSchema);