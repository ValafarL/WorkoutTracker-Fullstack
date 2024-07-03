import { Request, Response} from 'express'
import CustomAPIError from '../errors/custom-error'
import pool from '../db/connect'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async (req: Request, res: Response) =>{
    const {name, email, password} = req.body
    
    if(!name || !email || !password){
        throw new CustomAPIError('Please provide name, email and password', 401)
    }
    
    if(password.length < 6){
        throw new CustomAPIError('Password too short', 400)
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
    if (!emailRegex.test(email)) {
        throw new CustomAPIError('Please provide a valid email address', 401)
    }

    const {rows} = await pool.query(`
        SELECT COUNT(email) 
        FROM users 
        Where email = $1`, 
        [email])
    
    if(rows[0].count > 0){
        throw new CustomAPIError('Email already used', 400)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const response =  await pool.query(`
        INSERT INTO users(email, password, name) 
        VALUES($1, $2, $3)`,
        [email, hashedPassword, name])
    
    res.status(201).json({msg:'user registered', response:response})
}

const login = async (req: Request, res: Response) =>{
    const {email, password} = req.body

    if(!email || !password){
        throw new CustomAPIError('Please provide name, email and password', 401)
    }

    const {rows} = await pool.query(`
        SELECT user_code, email, password, name 
        FROM users Where email = $1`, 
        [email])
    const user = rows[0]

    if(!user){
        throw new CustomAPIError('Email or Password is incorrect', 401)
    }

    const isPasswordTheSame = bcrypt.compare(user.password, password)
    
    if(!isPasswordTheSame){
        throw new CustomAPIError('Email or Password is incorrect', 401)
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const JWT = jwt.sign({userID:user.user_code, name: user.name}, 
        jwtSecret as string,
        {
        expiresIn: '5h'
    })
    
    res.status(200).json({msg: "login successfull", jwt:JWT})
}

export {register, login}