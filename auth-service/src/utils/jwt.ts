import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN =  process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export const generateJwtToken = (payload :string | object | Buffer) =>{
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
};

export const generateRefreshToken = (payload: string| object | Buffer) => {
   return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES_IN}); 
};

export const verifyJwtToken = (token: string) =>{
    return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) =>{
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
};
