
import { useMemo, useState } from 'react'
import { BicepsFlexed, Check, Sparkles } from 'lucide-react'

import CustomSelect from '../common/CustomSelect'
import NumberField from '../common/NumberField'
import type { TrainingProgram } from '../../../domain/entities/TrainerDashboard'
import type {
  Exercise,
  ExerciseType,
  IntensityLevel,
  MuscleGroup,
} from '../../../domain/entities/Exercise'
import type { GeneratedRoutine } from '../../../domain/entities/GeneratedRoutine'
import { INTENSITY_LEVELS } from '../../../domain/entities/Exercise'
import { GenerateRoutine } from '../../../application/use-cases/routines/GenerateRoutine'
import { createGenerateRoutinePort } from '../../../infrastructure/repositories/generateRoutineFactory'

import MuscleGroupGrid from './MuscleGroupGrid'
import SearchField from './SearchField'
import GeneratedRoutinePanel from './GeneratedRoutinePanel'

const generateRoutine = new GenerateRoutine(createGenerateRoutinePort())

/** Presenta los parámetros de la generación de una rutina y muestra el resultado. */
function GenerateSection({
  programs,
  exercises,
  muscleGroups,
}: {
  programs: TrainingProgram[]
  exercises: Exercise[]
  muscleGroups: MuscleGroup[]
}) {
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([])
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [muscleGroupIds, setMuscleGroupIds] = useState<number[]>([])
  const [routineName, setRoutineName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [exerciseCount, setExerciseCount] = useState('8')
  const [intensity, setIntensity] = useState<IntensityLevel>('Medio')
  const [typeProportions, setTypeProportions] = useState<Record<ExerciseType, number>>({
    Fuerza: 40,
    Cardio: 30,
    Flexibilidad: 30,
  })
  const [generatedRoutine, setGeneratedRoutine] = useState<GeneratedRoutine | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const filteredExercises = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase()
    if (!term) return exercises
    return exercises.filter((exercise) =>
      `${exercise.name} ${exercise.type} ${exercise.muscleGroups.map((group) => group.name).join(' ')}`
        .toLocaleLowerCase()
        .includes(term),
    )
  }, [exercises, searchTerm])

  const toggleProgram = (programId: number) => {
    const id = String(programId)
    setSelectedProgramIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const toggleExercise = (exerciseId: number) => {
    const exercise = exercises.find((item) => item.id === exerciseId)
    if (!exercise) return
    setSelectedExercises((current) =>
      current.some((item) => item.id === exerciseId)
        ? current.filter((item) => item.id !== exerciseId)
        : [...current, exercise],
    )
  }

  const setExerciseIntensity = (exerciseId: number, level: IntensityLevel) => {
    const exercise = exercises.find((item) => item.id === exerciseId)
    if (!exercise) return
    setSelectedExercises((current) => {
      const existing = current.find((item) => item.id === exerciseId)
      if (existing) {
        return current.map((item) => (item.id === exerciseId ? { ...item, intensity: level } : item))
      }
      return [...current, { ...exercise, intensity: level }]
    })
  }

  const toggleMuscleGroup = (groupId: number) => {
    setMuscleGroupIds((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId],
    )
  }

  const setProportion = (type: ExerciseType, value: string) => {
    setTypeProportions((current) => ({ ...current, [type]: Math.max(0, Number(value) || 0) }))
  }

  const handleGenerate = async () => {
    const requestPrograms = programs.filter((program) => selectedProgramIds.includes(String(program.id)))
    if (requestPrograms.length === 0 || selectedExercises.length === 0) {
      setGenerateError('Selecciona al menos un programa y un ejercicio.')
      return
    }

    const proportionsTotal = Object.values(typeProportions).reduce((sum, value) => sum + value, 0)
    if (proportionsTotal !== 100) {
      setGenerateError('Las proporciones deben sumar exactamente 100.')
      return
    }

    setGenerating(true)
    setGenerateError(null)
    try {
      const routine = await generateRoutine.execute({
        programs: requestPrograms,
        exercises: selectedExercises,
        exerciseCount: Number(exerciseCount) || 1,
        muscleGroupIds,
        typeProportions,
        intensity,
        name: routineName.trim(),
      })
      setGeneratedRoutine(routine)
    } catch {
      setGenerateError('No se pudo generar la rutina.')
    } finally {
      setGenerating(false)
    }
  }

  const proportionTotal = Object.values(typeProportions).reduce((sum, value) => sum + value, 0)

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:flex-wrap">
      <section className="w-full min-w-0 xl:flex-1 rounded-2xl border border-[#e3ecea] bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#eaf5f3] text-[#008d82]"><Sparkles size={21} /></span>
          <div>
            <h2 className="font-bold text-[#214c48]">Criterios de generación</h2>
            <p className="mt-1 text-xs text-[#91a29f]">Configura los parámetros de la rutina</p>
          </div>
        </div>

        <div className="space-y-5">

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#52716d]">Nombre de la rutina</span>
            <input
              value={routineName}
              onChange={(event) => setRoutineName(event.target.value)}
              placeholder="Deja vacío para un nombre automático"
              maxLength={60}
              className="w-full rounded-xl border border-[#dce8e7] px-3 py-3 text-sm outline-none focus:border-[#00a699]"
            />
          </label>

          <div>
            <span className="mb-3 block text-sm font-semibold text-[#52716d]">Programas de entrenamiento (mínimo 1)</span>
            <div className="flex flex-wrap gap-2">
              {programs.map((program) => {
                const selected = selectedProgramIds.includes(String(program.id))
                return (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => toggleProgram(program.id)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${selected ? 'border-[#8ccdc5] bg-[#eaf5f3] text-[#00645d]' : 'border-[#dce8e7] text-[#718783] hover:bg-[#f7faf9]'}`}
                  >
                    {selected && <Check size={14} className="mr-1 inline" />}
                    {program.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="text-sm font-semibold text-[#52716d] sm:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span>Cobertura de grupos musculares</span>
              <span className="font-normal text-[#91a29f]">Selecciona los objetivos</span>
            </div>
            {muscleGroups.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 font-normal text-amber-800">No hay grupos musculares disponibles.</p>
            ) : (
              <MuscleGroupGrid
                muscleGroups={muscleGroups}
                selectedIds={muscleGroupIds}
                onToggle={toggleMuscleGroup}
              />
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#52716d]">Cantidad de ejercicios</span>
              <div className="w-full">
                <NumberField value={exerciseCount} onChange={setExerciseCount} />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#52716d]">Intensidad predominante</span>
              <div className="mt-2">
                <CustomSelect
                  value={intensity}
                  options={INTENSITY_LEVELS.map((level) => ({ value: level, label: level }))}
                  placeholder="Selecciona una intensidad"
                  onChange={(value) => setIntensity(value as IntensityLevel)}
                />
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <span className="block text-sm font-semibold text-[#52716d]">Proporción de ejercicios por tipo (%)</span>
            <div className="grid gap-4 sm:grid-cols-3">
              {(['Fuerza', 'Cardio', 'Flexibilidad'] as const).map((type) => (
                <label key={type} className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#52716d]">{type}</span>
                  <NumberField value={String(typeProportions[type])} onChange={(value) => setProportion(type, value)} />
                </label>
              ))}
            </div>
            <p className="text-xs text-[#91a29f]">Total configurado: {proportionTotal}%</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || selectedProgramIds.length === 0 || selectedExercises.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#004c4c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#00645d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Sparkles size={17} /> {generating ? 'Generando…' : 'Generar rutina'}
          </button>
          {generateError && <p role="alert" className="text-sm text-rose-700">{generateError}</p>}
          {generatedRoutine && <GeneratedRoutinePanel routine={generatedRoutine} />}
        </div>
      </section>

      <aside className="w-full xl:w-[min(42%,420px)] xl:shrink-0 rounded-2xl border border-[#e3ecea] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#eaf5f3] text-[#008d82]"><BicepsFlexed size={21} /></span>
          <div>
            <h3 className="font-bold text-[#214c48]">Banco disponible</h3>
            <p className="mt-1 text-xs text-[#91a29f]">Selecciona ejercicios para confeccionar la rutina.</p>
          </div>
        </div>
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nombre, grupo muscular o tipo"
          ariaLabel="Buscar ejercicios de la rutina"
        />
        <div className={`mt-4 space-y-3 rounded-xl border border-[#dce8e7] bg-white p-3 ${filteredExercises.length > 5 ? 'max-h-100 overflow-y-auto' : ''}`}>
          {filteredExercises.map((exercise) => {
            const selected = selectedExercises.some((item) => item.id === exercise.id)
            const selectedIntensity = selectedExercises.find((item) => item.id === exercise.id)?.intensity ?? exercise.intensity
            return (
              <label
                key={exercise.id}
                className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 font-medium transition ${selected ? 'border-[#00a699] bg-[#eaf6f4] text-[#00645d]' : 'border-[#edf2f1] text-[#607976] hover:border-[#b2d8d8]'}`}
              >
                <input type="checkbox" checked={selected} onChange={() => toggleExercise(exercise.id)} className="size-4 accent-[#008d82]" />
                <span className="flex-1">{exercise.name}</span>
                <span className="text-xs text-[#718783]">{exercise.type}</span>
                <div className="w-45">
                  <CustomSelect
                    value={selectedIntensity}
                    options={INTENSITY_LEVELS.map((level) => ({ value: level, label: level }))}
                    placeholder="Intensidad"
                    onChange={(value) => setExerciseIntensity(exercise.id, value as IntensityLevel)}
                  />
                </div>
              </label>
            )
          })}
          {filteredExercises.length === 0 && searchTerm.trim() && (
            <p className="text-sm text-amber-800">No hay ejercicios que coincidan con la búsqueda.</p>
          )}
          {filteredExercises.length === 0 && !searchTerm.trim() && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 font-normal text-amber-800">
              El banco está vacío. Regístralos primero en el apartado de ejercicios.
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}

export default GenerateSection
