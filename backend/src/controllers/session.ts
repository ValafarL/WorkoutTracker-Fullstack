import { Request, Response } from "express";
import pool from "../db/connect";
import CustomAPIError from "../errors/custom-error";

//update para o set_detail

const getSession = async(req: Request, res: Response) =>{
  const { session_code } = req.body
  if(!session_code){
    throw new CustomAPIError('Provide all values', 400)
  }
  const {rows} = await pool.query(`
    SELECT *
    FROM session as s JOIN set_detail as d
    ON s.session_code=d.session_code
    WHERE d.session_code=$1
    `, [session_code])
  res.status(200).json({session:rows})
}

const addSession = async (req: Request, res: Response) => {
  const { workout_code, date, exercises } = req.body

    if (!date || !workout_code || !exercises) {
      throw new CustomAPIError('Provide all session necessary values', 400)
    }
    if (!validateDate(date)) {
      throw new CustomAPIError('Invalid date format, please use YYYY-MM-DD', 400)
    }
   const client = await pool.connect()
   try {
     
     await client.query('BEGIN')

     const { rows } = await client.query(`
     INSERT INTO session(workout_code, date)
     VALUES($1, $2)
     RETURNING session_code
     `, [workout_code, date])

     const session_code = rows[0].session_code;
     
      const VALUES = exercises.reduce((acc: string, exercise: any) => {
        if (!(Array.isArray(exercise.reps) && Array.isArray(exercise.weights))) {
            throw new CustomAPIError('Reps and weights data are not type array', 400)
        }
        if (exercise.reps.length !== exercise.weights.length || exercise.weights.length !== exercise.sets) {
            throw new CustomAPIError('The size of the arrays and numbers of sets are not the same', 400)
        }
        if (exercise.sets > 10) {
            exercise.sets = 10
            exercise.reps = exercise.reps.slice(0, 10)
            exercise.weights = exercise.weights.slice(0, 10)
            console.log('The size of sets, reps, and weights arrays is too big, size changed to 10')
        }
        const exerciseValues = exercise.reps.map((rep: number, i: number) => 
            `(${session_code}, ${exercise.exercise_code}, ${i+1}, ${rep}, ${exercise.weights[i]})`
        ).join(',')
        return acc ? `${acc},${exerciseValues}` : exerciseValues
      }, '')
      await client.query(`
        INSERT INTO set_detail (session_code, exercise_code, set, reps, weight)
        VALUES ${VALUES}
      `)
      await client.query('END')
      await client.query('COMMIT')
      res.status(201)
    } catch (error) {
      await client.query('ROLLBACK')
      console.log(error)
      throw new CustomAPIError('Transaction not successful', 400)
    } finally {
      client.release()
    }
};


const deleteSession = async (req: Request, res: Response) =>{
    const {session_code, exercise_code} = req.body;

    const client = await pool.connect()
    if (!session_code) {
        throw new CustomAPIError('Provide a value', 400);
    }
    try {
        await client.query('BEGIN')
        await client.query('DELETE FROM set_detail WHERE session_code = $1', [session_code])
        await client.query('DELETE FROM workout_session WHERE session_code = $1', [session_code])
        await client.query('DELETE FROM session WHERE session_code = $1', [session_code])
        await client.query('COMMIT')
        res.status(200)
      } catch (error) {
        await client.query('ROLLBACK')
        throw new CustomAPIError('Failed to delete session', 500)
      } finally {
        client.release()
      }
}

const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date)
};
export { addSession, deleteSession, getSession}
