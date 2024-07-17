import {Request, Response} from 'express'
import CustomAPIError from '../errors/custom-error'
import pool from '../db/connect'

const getWorkouts = async(req:Request, res:Response) =>{
    const workout_plan_code = parseInt(req.params.id, 10);
    console.log('codiguim ',workout_plan_code)
    if(!workout_plan_code){
        throw new CustomAPIError('Please provide all values', 400)
    }
    const {rows} = await pool.query(`
        SELECT *
        FROM workout
        WHERE workout_plan_code=$1
        `, [workout_plan_code])
    res.status(200).json({workouts:rows})
}
const updateWorkout = async(req:Request, res:Response) =>{
    const {workout_code, title} = req.body
    if(!workout_code || !title){
        throw new CustomAPIError('Please provide all values', 400)
    }
    const {rows} = await pool.query(`
        UPDATE workout
        SET title=$2
        WHERE workout_code=$1
        `, [workout_code, title])
    res.status(201).json({updated_workout:rows})
}

const addWorkout = async (req:Request, res:Response) =>{
    //exercises_code must be an array
    const {workout_plan_code, week_days, title, exercises_code} = req.body
    if(!workout_plan_code || !week_days || !title || !exercises_code){
        throw new CustomAPIError('Please provide all values', 400)
    }
    const {rowCount} = await pool.query(`
        SELECT workout_plan_code 
        FROM workout_plan 
        WHERE workout_plan_code = $1`, 
        [workout_plan_code])
    if (rowCount === 0) {
        throw new CustomAPIError('Workout plan does not exist', 400)
    }
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const {rows} = await client.query(`
            INSERT INTO workout(workout_plan_code, week_days, title)
            VALUES($1, $2, $3)
            RETURNING workout_code`,
            [workout_plan_code, week_days, title])
        const workout_code = rows[0].workout_code
        const values = exercises_code.map((exercise_code: number, index: number) => `(${workout_code}, ${exercise_code})`).join(',')
        const response = await client.query(`
            INSERT INTO workout_exercises(workout_code, exercise_code)
            VALUES ${values}
            RETURNING workout_code, exercise_code`)
        await client.query('END')
        await client.query('COMMIT')

        const workout_exercises = response.rows
        res.status(200).json({workout_exercises:workout_exercises})
    } catch (error) {
        await client.query('ROLLBACK')
        console.log(error)
        throw new CustomAPIError('Something went wrong creating workout', 500)
    }finally{
        client.release()
    }
}

//all workouts associated with one workout_plan is deleted
//when the workout_plan is deleted in workout_plan controller

const deleteOneWorkout = async (req:Request, res:Response) =>{
    const {workout_plan_code, workout_code} = req.body
    if(!workout_plan_code || !workout_code){
        throw new CustomAPIError('Please provide all values', 400)
    }
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query(`
            WITH deleted_exercises AS (
                DELETE FROM workout_exercises
                WHERE workout_code = $1
                RETURNING workout_code
            )
            DELETE FROM workout
            WHERE workout_plan_code = $2 AND workout_code = $1
        `, [workout_code, workout_plan_code]);
        await client.query('END')
        await client.query('COMMIT')

        res.status(200).json({msg: 'workout deleted'})
    } catch (error) {
        await client.query('ROLLBACK')
        console.log(error)
        throw new CustomAPIError('Something went wrong on deleting the workout', 500)
    }finally{
        client.release()
    }
}

export {addWorkout, deleteOneWorkout, getWorkouts, updateWorkout}