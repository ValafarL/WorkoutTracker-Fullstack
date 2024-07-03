import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import errorHandlerMiddleware from './middlewares/error-handler'

//routes
import authRouter from './routes/auth'
import exercRouter from './routes/exercise'
import wrkPlanRouter from './routes/workout_plan'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('BEQUI ENDI')
})
app.use('/api/auth', authRouter)
app.use('/api/user', exercRouter)
app.use('/api/user', wrkPlanRouter)
app.use(errorHandlerMiddleware)


app.listen(PORT, ()=>{
    console.log(`SERVER listen on port${PORT}`)
})