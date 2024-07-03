import {Request, Response} from 'express'
import pool from '../db/connect'
import CustomAPIError from '../errors/custom-error'
import { deleteAllWorkoutsInWorkoutPlan } from './workout'
import isValidUser from './verifyUser'

const getAllWorkoutsPlan = async (req:Request, res:Response) =>{
    const {user_code} = req.body
    if(!user_code){
        throw new CustomAPIError('Provide all the values', 400)
    }

    isValidUser(user_code)
    const {rows} = await pool.query(
        `SELECT * 
        FROM workout_plan
        WHERE user_code=$1`, 
        [user_code])
    const all_user_workouts_plan = rows
    res.status(201).json({msg: 'all workouts_plan', all_user_workouts_plan:all_user_workouts_plan})
}

const addWorkoutPlan = async (req:Request, res:Response) =>{
    const {user_code, init_date, end_date} = req.body
    if(!user_code || !init_date || !end_date){
        throw new CustomAPIError('Provide all the values', 400)
    }
    isValidUser(user_code)
    const {rows} = await pool.query(
        `INSERT INTO workout_plan(user_code, init_date, end_date)
        VALUES($1,$2,$3) 
        RETURNING workout_plan_code, init_date, end_date`, 
        [user_code, init_date, end_date])
    const workout_plan = rows[0]
    res.status(201).json({msg: 'workout created', workout_plan:workout_plan})
}

const updateWorkoutPlan = async (req:Request, res:Response) =>{
    const {workout_plan_code, user_code, end_date} = req.body
    isValidUser(user_code)
    if(!workout_plan_code || !user_code || !end_date){
        throw new CustomAPIError('Provide an valide date', 400)
    }
    const {rows} = await pool.query(
        `UPDATE workout_plan
        SET end_date=$3
        WHERE workout_plan_code=$1 and user_code=$2
        RETURNING workout_plan_code, init_date, end_date`, 
        [workout_plan_code, user_code, end_date])
    res.status(201).json({msg: 'workout updated', rows:rows})
}

const deleteWorkoutPlan = async (req:Request, res:Response) =>{
    const {workout_plan_code, user_code} = req.body
    isValidUser(user_code)
    if(!workout_plan_code || !user_code){
        throw new CustomAPIError('user or workout-plan are invalid', 400)
    }
    deleteAllWorkoutsInWorkoutPlan(workout_plan_code)
    await pool.query(
        `DELETE
        FROM workout_plan
        WHERE workout_plan_code=$1 and user_code=$2`, 
        [workout_plan_code, user_code])
    res.status(201).json({msg: `workout plan ID ${workout_plan_code} from user${user_code} deleted`, deleted: true})
}

export {addWorkoutPlan, 
    updateWorkoutPlan,
    deleteWorkoutPlan,
    getAllWorkoutsPlan}