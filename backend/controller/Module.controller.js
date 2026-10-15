import { Module } from "../model/Modules.model.js";
import { Roadmap } from "../model/Roadmap.model.js";
import { generateModule } from "../service/aiService.js";

export const createModule=async(req,res)=>{
    try {
        const{roadmapId,moduleId}=req.params;
        const userId=req.user._id;

         if (!userId) {
      return res.status(401).json({ message: "Unauthorize access", success: false });
    }
    if (!roadmapId || !moduleId) {
      return res.status(400).json({ message: "roadmapId and moduleId are required", success: false });
    }
    const existingModule=await Module.findOne({roadmapId:roadmapId,moduleId:Number(moduleId)});
     if (existingModule) {
      return res.status(200).json({
        message: "Module content found",
        success: true,
        data: existingModule,
      });
    }
    const roadmap=await Roadmap.findById(roadmapId);
     if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found", success: false });
    }
     if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    const moduleInfo= roadmap.modules.find((m)=>m.moduleId===Number(moduleId));
     if (!moduleInfo) {
      return res.status(404).json({ message: "Module not found in roadmap", success: false });
    }

    const aiContent=await generateModule(roadmap.topic,moduleInfo.title,moduleInfo.concept,roadmap.language);
        if (!aiContent || !aiContent.explanation) {
      return res.status(502).json({
        message: "Failed to generate module content. Please try again.",
        success: false,
      });
    }
    const newModule=await Module.create({
        roadmapId:roadmapId,
        moduleId:Number(moduleId),
        title:moduleInfo.title,
        ...aiContent
    })
     return res.status(201).json({
      message: "Module content generated successfully",
      success: true,
      data: newModule,
    });
    } catch (error) {
       console.log(error.message);
    return res.status(500).json({ message: "failed to get module content", success: false }); 
    }
}
export const markModuleComplete=async(req,res)=>{
    try {
        const {roadmapId,moduleId}=req.params;
        const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorize access", success: false });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found", success: false });
    }
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    const moduleInfo = roadmap.modules.find((m) => m.moduleId === Number(moduleId));
    if (!moduleInfo) {
      return res.status(404).json({ message: "Module not found in roadmap", success: false });
    }

     moduleInfo.status = "completed";
    await roadmap.save();

    return res.status(200).json({
      message: "Module marked as completed",
      success: true,
      data: roadmap,
    });
    } catch (error) {
         console.log(error.message);
    return res.status(500).json({ message: "internal server error", success: false });
    }
}