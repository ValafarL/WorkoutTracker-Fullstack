import CustomAPIError from '../errors/custom-error'
import pool from '../db/connect'

async function isValidUser(user_code:number){
    if(!user_code){
        throw new CustomAPIError('Provide an user', 400);
    }
    const {rowCount} = await pool.query(`
        SELECT user_code 
        FROM users 
        WHERE user_code = $1`, 
        [user_code]);
    if (rowCount === 0) {
        throw new CustomAPIError('User does not exist', 400);
    }
}

export default isValidUser