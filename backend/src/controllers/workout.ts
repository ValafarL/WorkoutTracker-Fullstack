import {Request, Response} from 'express'
import CustomAPIError from '../errors/custom-error'
import pool from '../db/connect'

const addWorkout = async (req:Request, res:Response) =>{
    const {workout_plan_code, week_days, title} = req.body
    if(!workout_plan_code || !week_days || !title){
        throw new CustomAPIError('Please provide all values', 400)
    }
    const {rowCount} = await pool.query(`
        SELECT workout_plan_code 
        FROM workout_plan 
        WHERE workout_plan_code = $1`, 
        [workout_plan_code]);
    if (rowCount === 0) {
        throw new CustomAPIError('Workout plan does not exist', 400);
    }
    const {rows} = await pool.query(`
        INSERT INTO workout(workout_plan_code, week_days, title)
        VALUES($1, $2, $3)
        RETURNING workout_code, workout_plan_code, week_days, title`,
        [workout_plan_code, week_days, title])
    const workout = rows[0]
    res.status(200).json({msg: 'workout created', workout:workout})
}

//used only inside deleteWorkoutPlan function in workout_plan controller
const deleteAllWorkoutsInWorkoutPlan = async (workout_plan_code:number) =>{
    await pool.query(`
        DELETE
        FROM workout
        WHERE workout_plan_code=$1`,
        [workout_plan_code])
}

const deleteOneWorkout = async (req:Request, res:Response) =>{
    const {workout_plan_code, workout_code} = req.body
    if(!workout_plan_code || !workout_code){
        throw new CustomAPIError('Please provide all values', 400)
    }
    await pool.query(`
        DELETE
        FROM workout
        WHERE workout_plan_code=$1 and workout_code=$2`,
        [workout_plan_code, workout_code])
    res.status(200).json({msg: 'workout deleted'})
}

export {addWorkout, deleteOneWorkout, deleteAllWorkoutsInWorkoutPlan}