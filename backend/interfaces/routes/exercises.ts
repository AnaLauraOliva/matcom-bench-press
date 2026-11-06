import { Router } from 'express'

export const exercisesRouter = Router()


//Data for testing
const myexercises = 
[
    {
        id: '1',
        name: 'bench press',
        muscles: ['chest','triceps'],
    },
    {
        id: '2',
        name: 'pull ups',
        muscles: ['lats','biceps'],            
    }
]

//get all exercises
exercisesRouter.get('/',(req,res)=>{
    res.json(myexercises)
})

//get exercises by ID
exercisesRouter.get('/:id',(req,res)=>{
    const {id} = req.params

    const exercise = myexercises.find((exercise)=> (id == exercise.id));
    
    if(!exercise){
        return res.json({Error:'exercise not found'})
    }

    return res.json(exercise)
})