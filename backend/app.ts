import express, { json } from 'express'
import { exercisesRouter } from './interfaces/routes/exercises.ts'

const app = express()

//Middleware
app.use(json())


//Routers
app.use('/exercises', exercisesRouter)


//
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})