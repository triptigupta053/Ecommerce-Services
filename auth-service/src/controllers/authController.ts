import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateJwtToken, generateRefreshToken } from '../utils/jwt';

type SignUpRequestBody = {
    email:string , 
    password: string,
    role?: string
}

type LoginRequestBody = {
    email: string,
    password: string
}

export const SignUp = async ( req:Request<{},{},SignUpRequestBody> , res:Response)=>{
    try{
        const { email, password, role } = req.body;

        if(!email || !password){
            return res.status(400).json({message:"Email and Password Required"})
        }

        const existingUser = await User.findOne({email});
        if(!existingUser){
            const user = await new User({email, password, role});
            const accessToken = generateJwtToken({id: user._id, role: user.role});
            const refreshToken = generateRefreshToken({id: user._id, role:user.role});
            user.refreshTokens.push(refreshToken);
            user.save();
            res.status(201).json({accessToken:accessToken, refreshToken:refreshToken});
        }else{
            return res.status(409).json({message:"Email already in use"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"});
    }

};

export const LogIn = async (req:Request<{}, {}, LoginRequestBody>, res: Response) =>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            res.status(400).json({message:"Email and Password is required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        const match = await user.comparePassword(password);
        if(!match){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        const accessToken = generateJwtToken({ id: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

        user.refreshTokens.push(refreshToken);
        await user.save();
        res.status(200).json({accessToken:accessToken, refreshToken:refreshToken, message: 'User LoggenIn SuccessFully' });

    }catch (err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const Logout = async (req:Request , res:Response)=>{
    try{
        const { email, refreshToken } = req.body;
        if (!refreshToken || !email) {
            res.status(409).json({ message: 'Refresh token and Email required' });
        }
        const user = await User.findOne({ email });
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await user.save();
            res.status(200).json({ message: 'Logged out successfully' });

        } else {
            res.status(404).json({ message: 'User not found' });
        }

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
