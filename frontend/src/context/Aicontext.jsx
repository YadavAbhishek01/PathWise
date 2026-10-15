import { createContext, useState } from "react";
import {axiosInstants } from "../units/axios.instants";
import toast from "react-hot-toast";
export const Aicontext=createContext();

export const AiProvider=({children})=>{

    const [roadmapData,setRoadmapData]=useState([])
    const [moduleData,setModuleData]=useState([])
    const [loading,setLoading]=useState(false)
    const [userRoadmapData,setUserRoadmapData]=useState([])
   
    const createRoadmap=async(data)=>{
        try {
            setLoading(true)
            const res=await axiosInstants.post('/ai/create/roadmap',data);
            if(res.data.success)
            {
                setRoadmapData(res.data.data);
                return res.data.data;
            }
            else{
                console.log(res.data.message);
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        }finally{
            setLoading(false)
        }
    }
    const generateModule=async(roadmapId,moduleId)=>{
        try {
            setLoading(true)
            const res=await axiosInstants.get(`/ai/${roadmapId}/${moduleId}`)
            if(res.data.success)
            {
                setModuleData(res.data.data)
                return true;
            }
        } catch (error) {
            console.log(error.response?.data?.message)
            toast.error(error.response?.data?.message)
        }finally{
            setLoading(false)
        }
    }
    const markModuleComplete=async(roadmapId,moduleId)=>{
        try {
            setLoading(true)
            const res=await axiosInstants.patch(`/ai/${roadmapId}/${moduleId}/complete`);
            if(res.data.success)
            {
                setRoadmapData(res.data.data)
                return true
            }
        } catch (error) {
            console.log(error.response?.data?.message);
            toast.error(error.response?.data?.message)
        }finally{
            setLoading(false)
        }
    }
    const getUserRoadmap=async()=>{
        try {
            setLoading(true)
            const res=await axiosInstants.get('ai/roadmap/user');
            if(res.data.success)
            {
                setUserRoadmapData(res.data.data);
            }   
        } catch (error) {
            toast.error(error.response?.data?.message)
            console.log(error.response?.data?.message)
        }finally{
            setLoading(false)
        }
    }
    const getRoadmapById=async(id)=>{
            try {
                setLoading(true)
                const res=await axiosInstants.get(`/ai/roadmap/${id}`)
                if(res.data.success)
                {
                    setRoadmapData(res.data.data);
                }
            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            }
    }
    const value={createRoadmap,roadmapData,loading,generateModule,moduleData,markModuleComplete,getUserRoadmap,userRoadmapData,getRoadmapById}
    return (
        <Aicontext.Provider value={value}>
            {children}
        </Aicontext.Provider>
    )
}