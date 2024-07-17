import {Request, Response} from 'express'
import pool from '../db/connect'
import CustomAPIError from '../errors/custom-error'
 
const getAllWorkoutsPlan = async (req:Request, res:Response) =>{
    const {user_code} = req.body
    if(!user_code){
        throw new CustomAPIError('Provide all the values', 400)
    }

    const {rows} = await pool.query(
        `SELECT * 
        FROM workout_plan
        WHERE user_code=$1`, 
        [user_code])
    const user_workouts_plan = rows
    res.status(201).json({user_workouts_plan:user_workouts_plan})
}

const addWorkoutPlan = async (req:Request, res:Response) =>{
    const {user_code, init_date, end_date} = req.body
    if(!user_code || !init_date || !end_date){
        throw new CustomAPIError('Provide all the values', 400)
    }
    const {rows} = await pool.query(
        `INSERT INTO workout_plan(user_code, init_date, end_date)
        VALUES($1,$2,$3) 
        RETURNING workout_plan_code, init_date, end_date`, 
        [user_code, init_date, end_date])
    const workout_plan = rows[0]
    res.status(201).json({workout_plan:workout_plan})
}

const updateWorkoutPlan = async (req:Request, res:Response) =>{
    const {workout_plan_code, user_code, init_date, end_date} = req.body
    if(!workout_plan_code || !user_code || !end_date || !init_date){
        throw new CustomAPIError('Provide a valide date', 400)
    }
    const {rows} = await pool.query(
        `UPDATE workout_plan
        SET init_date=$4, end_date=$3
        WHERE workout_plan_code=$1 and user_code=$2
        RETURNING workout_plan_code, init_date, end_date`, 
        [workout_plan_code, user_code, end_date, init_date])
    res.status(201).json({rows:rows})
}

const deleteWorkoutPlan = async (req:Request, res:Response) =>{
    const {workout_plan_code, user_code} = req.body
    if(!workout_plan_code || !user_code){
        throw new CustomAPIError('user or workout-plan are invalid', 400)
    }
    const client = await pool.connect()
    try {
        client.query('BEGIN')
        await client.query(`DELETE
            FROM workout_plan
            WHERE workout_plan_code=$1`, [workout_plan_code])
        client.query('END')
        client.query('COMMIT')
    } catch (error) {
        client.query('ROLLBACK')
        console.log(error)
        throw new CustomAPIError('Something went wrong on trying to delete the workout_plan', 500)
    }finally{
        client.release()
    }
    await pool.query(
        `DELETE
        FROM workout_plan
        WHERE workout_plan_code=$1 and user_code=$2`, 
        [workout_plan_code, user_code])
    res.status(201)
}

export {addWorkoutPlan, 
    updateWorkoutPlan,
    deleteWorkoutPlan,
    getAllWorkoutsPlan}