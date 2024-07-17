import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

//middlewares
import errorHandlerMiddleware from './middlewares/error-handler'
import authorizaion from './middlewares/authorization'

//routes
import authRouter from './routes/auth'
import exercRouter from './routes/exercise'
import wrkPlanRouter from './routes/workout_plan'
import sessionRouter from './routes/session'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('BEQUI ENDI')
})
app.use('/api/auth', authRouter)
app.use('/api/user', authorizaion, wrkPlanRouter)
app.use('/api/user', authorizaion, exercRouter)
app.use('/api/user', authorizaion, sessionRouter)
app.use(errorHandlerMiddleware)


app.listen(PORT, ()=>{
    console.log(`SERVER listen on port${PORT}`)
})