import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

export const connectDB =async() =>{
    if(!process.env.MONGO_URI){
        throw new Error('Mongo_URI not set');
    }
    await mongoose.connect(process.env.MONGO_URI!,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
};

export default app;
