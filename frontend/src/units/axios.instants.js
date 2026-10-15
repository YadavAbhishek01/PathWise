import axios from "axios";
import {jwtDecode} from 'jwt-decode'
export const axiosInstants = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});


export const isTokenExpire=(token)=>{
    if (!token) return true
    try {
        const decode=jwtDecode(token)
        const currentTime=Math.floor(Date.now()/1000)
        return decode.exp<currentTime
    } catch (error) {
        return true;
    }
}
const attachToken=(config)=>{
    const token=localStorage.getItem('token');
    if(token && !isTokenExpire(token))
    {   
        config.headers.Authorization= `Bearer ${token}`
    }
    else{
        localStorage.removeItem('token');
    }
    return config;
}
axiosInstants.interceptors.request.use(attachToken);