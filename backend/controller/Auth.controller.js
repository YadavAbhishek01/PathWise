import { sendMail } from "../config/nodemail.js";
import { Otp } from "../model/Otp.model.js";
import { User } from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const singUp=async(req,res)=>{
    try {
        const {username,email,password}=req.body;

        if(!username|| !email || !password)
        {
            return res.status(400).json({
                message:"username,email password is required",
                success:false
            })
        }
        const existsUser=await User.findOne({email});
        if(existsUser)
        {
            return res.status(400).json({
                message:"User Already exists",
                success:false
            })
        }
        const hasPassword=await bcrypt.hash(password,10);
        const otpCode=Math.floor(100000+Math.random()*900000);

        const userData=await User.create({
            username:username,
            email,
            password:hasPassword
        });
        await Otp.create({
            email:email,
            otp:otpCode,
            expireAt:new Date(Date.now()+5*60*1000)
        })
        await sendMail(email,otpCode,username)
        return res.status(201).json({
            message:"Verification send to your register email",
            success:true,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message:"failed to create user",
            success:false
        })
    }
}
export const signin=async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password)
        {
            return res.status(400).json({
                message:"email or password is required",
                success:false
            })
        }
        const findUser=await User.findOne({email});
         if(!findUser)
        {
            return res.status(400).json({
                message:"user not found",
                success:false
            })
        }
        const mathPassword=await bcrypt.compare(password,findUser.password);

       
        if(!mathPassword)
        {
             return res.status(400).json({
                message:"invalid credentials",
                success:false
            })
        }
        if(findUser.isVerify)
        {
            const token=jwt.sign({id:findUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});
            return res.status(200).json({
                message:"login successfully",
                success:true,
                data:findUser,
                isVerify:true,
                token:token
            })
        }
          return res.status(401).json({
                message:"email is not verify",
                success:false,
            })

    } catch (error) {
        console.log(error.message)
          return res.status(500).json({
                message:"internal server error",
                success:false,
            })   
    }
}
export const verfiyEmail=async(req,res)=>{
    try {
        const {email,otp}=req.body;

        if(!email)
        {
              return res.status(400).json({
                message:"email is required",
                success:false
            })
        }
        const findUser=await User.findOne({email}).select("-password");
        if(!findUser)
        {
              return res.status(400).json({
                message:"user not found",
                success:false
            })
        }
        const otpData=await Otp.findOne({email})
        if (!otpData) {
    return res.status(400).json({
        message: "OTP not found or already used, please request a new one",
        success: false
    });
}
        if(otpData.expireAt <new Date())
        {
            await Otp.deleteOne({email});
              return res.status(400).json({
                message:"otp has expired",
                success:false,
            })
        }
        if(otpData.otp.toString()===otp.toString())
        {
            await User.findOneAndUpdate({email},{isVerify:true})
            await Otp.deleteOne({email});
            return res.status(200).json({
                message:"Email verify successfully",
                success:true
            })
        }
        else{
             return res.status(400).json({
             message: "invalid otp",
            success: false
    });
        }
        
    } catch (error) {
            console.log(error.message)
            return res.status(500).json({
                message:'Internal Server Error',
                success:false
            })
    }
}
export const resentOpt=async(req,res)=>{
    try {
        const {email}=req.body;

        if(!email)
        {
            return res.status(400).json({
                message:"email is required",
                success:false
            })
        }
        const findUser=await User.findOne({email}).select('-password')
        const otpCode=Math.floor(100000 + Math.random() *900000);
        const otpExits=await Otp.findOne({email});
        if(otpExits)
        {
            await Otp.deleteOne({email})
        }
        await Otp.create({
            email,
            otp:otpCode,
            expireAt:new Date(Date.now()+5*60*1000)
        })
        await sendMail(email,otpCode,findUser.username)
        return res.status(201).json({
            message:"otp send successfully",
            success:true,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}
export const getMe=async(req,res)=>{
    return res.status(200).json({
        message:"Authorize User",
        success:true,
        data:req.user
    })
}