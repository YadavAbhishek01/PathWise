import 'dotenv/config'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDb } from './config/Db.js';
import AuthRoutes from './routes/Auth.routes.js';
import aiRoutes from './routes/ai.routes.js'
// dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();
app.use(cors({
    origin:"*"
}))
app.get('/',(req,res)=>{
    res.send(`backend api runnig 🚀`)
})
app.use('/api/auth',AuthRoutes);
app.use('/api/ai',aiRoutes);

const port=process.env.PORT
app.listen(port,(req,res)=>{
    console.log(`server is running on http://localhost:${port}`);
})