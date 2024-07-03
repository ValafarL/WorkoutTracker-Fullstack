import express, {Router} from "express"
import { addWorkoutPlan, 
    deleteWorkoutPlan, 
    getAllWorkoutsPlan, 
    updateWorkoutPlan} from "../controllers/workout_plan"
import { addWorkout, deleteOneWorkout } from "../controllers/workout"


const router: Router = express.Router()

router.route('/workout-plan').get(getAllWorkoutsPlan).post(addWorkoutPlan)
router.route('/workout-plan/:id').delete(deleteWorkoutPlan).patch(updateWorkoutPlan)
router.route('/workout-plan/:id/workout').get().post(addWorkout).delete(deleteOneWorkout)

export default router