import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/auth'
import pool from './db/connect'
import errorHandlerMiddleware from './middlewares/error-handler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('BEQUI ENDI')
})
app.use('/api/auth', router)
app.get('/api/users', async (req: any, res: any) => {
    try {
      const result = await pool.query('SELECT * FROM users'); // Verifique o nome da tabela
      res.json(result.rows);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).json({ error: 'Database query failed' });
    }
  });
  app.use(errorHandlerMiddleware)


app.listen(PORT, ()=>{
    console.log(`SERVER listen on port${PORT}`)
})