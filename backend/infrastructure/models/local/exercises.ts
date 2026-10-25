import exercises from '../../database/local/exercises.json' with {type: 'json'}

export class ExercisesModel {
    
    static async getAll(){
        return exercises;
    }

    static async getById({ id }: { id: string }){
        const exercise = exercises.find(exercise => exercise.id === id)

        return exercise
    }
}