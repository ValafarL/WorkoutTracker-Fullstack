import {Request, Response} from 'express'
import CustomAPIError from '../errors/custom-error'
import pool from '../db/connect'
import isValidUser from './verifyUser'

const getAllExercises = async (req:Request, res:Response) =>{
    const {user_code} = req.body
    const admin_code = process.env.ADMIN_CODE

    isValidUser(user_code)

    const {rows} = await pool.query(`
        SELECT exercise_code, name 
        FROM exercises 
        WHERE user_code=$1 or user_code=$2`, 
        [admin_code, user_code])
    const exercises = rows
    res.status(200).json({msg:'all exercises', exercises:exercises})
}
const addExercise = async (req:Request, res:Response)=>{
    const {name, user_code} = req.body
    if(!name){
        throw new CustomAPIError('Please provide a name', 400)
    }

    isValidUser(user_code)

    const response = await pool.query(`
        INSERT INTO exercises(user_code, name)
        VALUES($1, $2)`, 
        [user_code, name])
    res.status(201).json({msg:'Exercise add', response:response})
}

const deleteExercise = async (req:Request, res:Response)=>{
    const {user_code, exercice_code} = req.body
    if(!user_code || !exercice_code){
        throw new CustomAPIError('Please provide valid values', 400)
    }

    isValidUser(user_code)

    const response = await pool.query(`
        DELETE 
        FROM exercises 
        WHERE exercise_code=$1 and user_code=$2`, 
        [exercice_code, user_code])
    res.status(201).json({msg:'Exercise deleted', response:response})
}

export {getAllExercises, addExercise, deleteExercise}