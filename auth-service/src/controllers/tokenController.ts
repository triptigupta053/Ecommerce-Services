import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { generateJwtToken, generateRefreshToken } from '../utils/jwt';

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Missing TRequest Token' })
        }
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
        const user = await User.findById(decode.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: 'Invalid Rewfresh token' })
        }

        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        const newAcessToken = generateJwtToken({id:user._id, role:user.role});
        const newRefreshToken = generateRefreshToken({id:user._id, role:user.role});
        user.refreshTokens.push(newRefreshToken);
        await user.save()
        res.status(200).json({accessToken:newAcessToken, refreshToken: newRefreshToken})

    } catch (err) {
        return res.status(403).json({message:'Invalid or Expired Refresh Token'});
    }

}

export default refreshToken;