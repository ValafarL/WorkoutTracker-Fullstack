import express, {Router} from "express"
import { addWorkoutPlan, 
    deleteWorkoutPlan, 
    getAllWorkoutsPlan, 
    updateWorkoutPlan} from "../controllers/workout_plan"
import { addWorkout, 
    deleteOneWorkout, 
    getWorkouts, 
    updateWorkout } from "../controllers/workout"


const router: Router = express.Router()

router.route('/workout-plan').get(getAllWorkoutsPlan).post(addWorkoutPlan)
router.route('/workout-plan/:id').delete(deleteWorkoutPlan).patch(updateWorkoutPlan)
router.route('/workout-plan/:id/workout').get(getWorkouts).post(addWorkout).delete(deleteOneWorkout)
router.route('/workout-plan/:id/workout/:id').get().patch(updateWorkout)

export default router