import mongoose from "mongoose";

export const connectDb=()=>{
    try {
        const conn=process.env.MONGOOS_URL
        mongoose.connect(conn);
        console.log("mongooseDb connection successful ✅")
        
    } catch (error) {
        console.log(error.message)
    }
}