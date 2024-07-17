import express, {Router} from 'express'
import { addExercise, deleteExercise, getAllExercises } from '../controllers/exercise'

const router: Router = express.Router()

router.route('/exercise').get(getAllExercises).post(addExercise)
router.route('/exercise/:id').delete(deleteExercise)

export default router 