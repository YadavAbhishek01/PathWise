import mongoose from "mongoose";

const moduleSchema=new mongoose.Schema({
    roadmapId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Roadmap",
        required:true
    },
    moduleId:{
        type:Number,
        required:true,
    },
    title: String,
  explanation: String,
  examples: [String],
  codeSnippets: [String],
  practiceQuestions: [String],
  connectionToNext: String,
},{timestamps:true})

export const Module=mongoose.model("Module",moduleSchema)