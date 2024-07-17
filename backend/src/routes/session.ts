import express, {Router} from 'express'
import { addSession, deleteSession, getSession } from '../controllers/session'
const router:Router =  express.Router()

router.route('/workout-plan/:id/workout/session')
.post(addSession)
.patch()
.delete(deleteSession)
.get(getSession);

export default router