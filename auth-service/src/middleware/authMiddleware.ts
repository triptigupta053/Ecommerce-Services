import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any;
}
const authenticateUser = (req:AuthenticatedRequest, res:Response, next:NextFunction) =>{
    const authHeader = req.get('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({message:'Unauthorized'});
    }
    const headerToken = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(headerToken, process.env.JWT_SECRET!);
       (req as any).user = decoded;
       next();
    }catch(err){
        return res.status(401).json({message:'Invalid or Expired token'});
    }
}

export default authenticateUser;
