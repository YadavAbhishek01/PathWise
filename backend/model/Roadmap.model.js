import mongoose from "mongoose";

const roadmapSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    topic:{
        type:String,
        required:true
    },
     level: { type: String, default: "beginner" },
    language: { type: String, default: "English" },
    modules:[
        {
            moduleId:{
                type:Number,
                required:true,
            },
            title:{
                type:String,
                required:true
            },
            concept:{
                type:[String],
                default:[]
            },
             prerequisiteStep: { type: [Number], default: [] },
             status: { type: String, default: "not-started" },
        }
    ]
},{timestamps:true})

export const Roadmap=mongoose.model("Roadmap",roadmapSchema);