import { Roadmap } from "../model/Roadmap.model.js";
import { generateRoadmap } from "../service/aiService.js";

export const createRoadmap=async(req,res)=>{
    try {
        const {topic,level,language}=req.body;
        const userId=req.user._id;

        if(!userId)
        {
             return res.status(400).json({
                message:"Unauthorize access",
                success:false
            })
        }
        if(!topic)
        {
            return res.status(400).json({
                message:"topic is missing",
                success:false
            })
        }
        const normizedTopic=topic.trim().toLowerCase();
        const existingRoadmap=await Roadmap.findOne({userId,topic:normizedTopic,level,language});
        if(existingRoadmap)
        {
            return res.status(200).json({
        message: "roadmap found in database",
        success: true,
        data: existingRoadmap,
      });
        }

        const aiData=await generateRoadmap(topic,level,language);
        if (!aiData || !Array.isArray(aiData.modules) || aiData.modules.length === 0) {
      return res.status(502).json({
        message: "Failed to generate a valid roadmap. Please try again.",
        success: false,
      });
    }
        else{
            const roadmapData=await Roadmap.create({
                userId,
                topic:normizedTopic,
                level,
                language,
                modules:aiData.modules
            })
             return res.status(201).json({
                message:"Roadmap created successfully",
                success:true,
                data:roadmapData
            })
        }
    } catch (error) {
            console.log(error.message)
              return res.status(500).json({
        message: "Internal server error",
        success: false
    }); 
    }
}
export const getUserRoadmap=async(req,res)=>{
    try {
        const userId=req.user._id;
        if(!userId)
        {
            return res.status(401).json({
                message:"You are not authorize",
                success:false
            })
        }

        const findUsersRoadmap=await Roadmap.find({userId});
        if(findUsersRoadmap.length===0)
        {
            return res.status(400).json({
                message:"roadmap not found",
                success:false
            })
        }
            return res.status(200).json({
                message:"roadmap found",
                success:true,
                total:findUsersRoadmap.length,
                data:findUsersRoadmap
            })
    } catch (error) {
        console.log(error.message)
         return res.status(500).json({
        message: "Internal server error",
        success: false
    });
    }
}
export const getRoadmap = async (req, res) => {
  try {
    const { id } = req.params; // roadmap id
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorize access", success: false });
    }
    if (!id) {
      return res.status(400).json({ message: "Id is missing", success: false });
    }

    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found", success: false });
    }

    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    return res.status(200).json({
      message: "Roadmap found successfully",
      success: true,
      data: roadmap,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "internal server error", success: false });
  }
};