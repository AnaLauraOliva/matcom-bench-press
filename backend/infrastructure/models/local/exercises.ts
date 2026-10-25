import exercises from '../../database/local/exercises.json' with {type: 'json'}

interface ExerciseFilters {
    muscle?: string;
}

export class ExercisesModel {
    
    static async getAll(filters:ExerciseFilters){
        if (filters.muscle) {
            return exercises.filter(
                exercise => exercise.muscles.some(m => m.toLowerCase() === filters.muscle!.toLowerCase())
            )
        } 

        return exercises;
    }

    static async getById({ id }: { id: string }){
        const exercise = exercises.find(exercise => exercise.id === id)

        return exercise
    }
}