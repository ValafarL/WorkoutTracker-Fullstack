import { Request, Response, NextFunction } from 'express';
import CustomAPIError from '../errors/custom-error';
const jwt = require('jsonwebtoken')

const authorization = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new CustomAPIError('Authentication invalid', 400)
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.body = { ...req.body, user_code: payload.user_code, name: payload.name };
        next()
    } catch (error) {
        throw new CustomAPIError('You dont have an autorized token to access this', 400)
    }
};

export default authorization;
