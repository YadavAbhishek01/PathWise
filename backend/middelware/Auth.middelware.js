
import jwt from 'jsonwebtoken'
import { User } from '../model/User.model.js';
export const authMiddelware=async(req,res,next)=>{
        try {
            const authHeader=req.headers.authorization;

            if(!authHeader || !authHeader.startsWith("Bearer"))
            {
                return res.status(401).json({
                    message:"You are not authorize",
                    success:false
                })
            }
            const token=authHeader.split(" ")[1];
            if(!token)
            {
                 return res.status(401).json({
                    message:"You are not authorize",
                    success:false
                })
            }
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            const user=await User.findById(decode.id).select("-password");
            if(!user){
                return res.status(401).json({
                    message:"You are not authorize",
                    success:false
                })
            }
            req.user=user;
            return next();
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message:"internal server error",
                success:false
            })
        }
}