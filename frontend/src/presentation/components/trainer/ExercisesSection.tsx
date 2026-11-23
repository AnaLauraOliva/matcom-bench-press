
import { useMemo, useState, type FormEvent } from 'react'
import { BookOpen, Plus, X } from 'lucide-react'

import CustomSelect from '../common/CustomSelect'
import type {
  CreateExerciseInput,
  Exercise,
  MuscleGroup,
} from '../../../domain/entities/Exercise'

import MuscleGroupGrid from './MuscleGroupGrid'
import SearchField from './SearchField'

/** Permite consultar, buscar y registrar ejercicios en el banco. */
function ExercisesSection({
  exercises,
  onAddExercise,
  muscleGroups,
  isLoading,
}: {
  exercises: Exercise[]
  onAddExercise: (input: CreateExerciseInput) => Promise<void>
  muscleGroups: MuscleGroup[]
  isLoading: boolean
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<Exercise['type']>('Fuerza')
  const [description, setDescription] = useState('')
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  // Filtra el banco según la búsqueda por nombre, tipo y grupos musculares.
  const visibleExercises = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase()

    if (!normalizedSearch) return exercises

    return exercises.filter((exercise) =>
      `${exercise.name} ${exercise.muscleGroups.map((group) => group.name).join(' ')} ${exercise.type}`
        .toLocaleLowerCase()
        .includes(normalizedSearch),
    )
  }, [exercises, searchTerm])

  const toggleMuscleGroup = (groupId: number) => {
    setSelectedGroupIds((current) => current.includes(groupId)
      ? current.filter((id) => id !== groupId)
      : [...current, groupId])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName || !description.trim() || selectedGroupIds.length === 0) {
      setFormError('Indica un nombre, una descripción y selecciona al menos un grupo muscular.')
      return
    }

    setIsSaving(true)
    setFormError(null)
    try {
      await onAddExercise({
        name: trimmedName,
        description,
        type,
        muscleGroupIds: selectedGroupIds,
      })
      setName('')
      setDescription('')
      setType('Fuerza')
      setSelectedGroupIds([])
      setShowForm(false)
    } catch {
      setFormError('No se pudo registrar el ejercicio. Comprueba los datos e inténtalo de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-[#e3ecea] bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <h2 className="font-bold text-[#214c48]">Ejercicios registrados</h2>
          <p className="mt-1 text-xs text-[#91a29f]">
            {visibleExercises.length} ejercicios encontrados
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar ejercicio o listar por grupo muscular o tipo"
            ariaLabel="Buscar ejercicios"
          />

          <button
            type="button"
            onClick={() => { setShowForm((current) => !current); setFormError(null) }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#004c4c] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#00645d]"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancelar' : 'Añadir ejercicio'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-y-4 gap-x-4 rounded-xl border border-[#dce8e7] bg-[#f8fbfa] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#52716d] sm:col-span-2">
            Nombre del ejercicio
            <input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Press de banca" className="mt-2 w-full rounded-lg border border-[#dce8e7] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00a699]" />
          </label>

          <label className="text-xs font-semibold text-[#52716d] sm:col-span-2">
            Descripción del ejercicio

            <textarea
              required
              maxLength={300}
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe cómo se realiza el ejercicio..."
              className="mt-2 w-full resize-none rounded-lg border border-[#dce8e7] bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[#00a699] focus:ring-2 focus:ring-[#00a699]/10"
            />

            <span className="mt-0.5 block text-right font-normal text-[#91a29f]">
              {description.length}/300 caracteres
            </span>
          </label>

          <label className="text-xs font-semibold text-[#52716d] sm:col-span-2">
            Tipo de ejercicio

            <div className="mt-2">
              <CustomSelect
                value={type}
                options={[
                  { value: 'Fuerza', label: 'Fuerza' },
                  { value: 'Cardio', label: 'Cardio' },
                  { value: 'Flexibilidad', label: 'Flexibilidad' },
                ]}
                placeholder="Selecciona un tipo"
                onChange={(value) => setType(value as Exercise['type'])}
              />
            </div>
          </label>

          <div className="text-xs font-semibold text-[#52716d] sm:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span>Grupos musculares</span>
              <span className="font-normal text-[#91a29f]">Puedes seleccionar varios</span>
            </div>
            {isLoading ? (
              <p className="rounded-lg border border-[#dce8e7] bg-white p-3 font-normal text-[#718783]">Cargando grupos musculares…</p>
            ) : muscleGroups.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 font-normal text-amber-800">No hay grupos musculares disponibles.</p>
            ) : (
              <MuscleGroupGrid
                muscleGroups={muscleGroups}
                selectedIds={selectedGroupIds}
                onToggle={toggleMuscleGroup}
              />
            )}
          </div>
          {selectedGroupIds.length > 0 && (
            <p className="text-xs font-normal text-[#718783] sm:col-span-2">
              Seleccionados: {muscleGroups.filter((group) => selectedGroupIds.includes(group.id)).map((group) => group.name).join(', ')}
            </p>
          )}
          {formError && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{formError}</p>}
          <div className="sm:col-span-2">
            <button type="submit" disabled={isSaving || isLoading || muscleGroups.length === 0} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#008d82] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#00776e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              <Plus size={15} /> {isSaving ? 'Guardando…' : 'Guardar ejercicio'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-sm text-[#91a29f]">Cargando ejercicios…</div>
      ) : exercises.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf2f1] text-[11px] uppercase tracking-wider text-[#91a29f]">
                <th className="px-3 py-3 font-bold">Ejercicio</th>
                <th className="px-3 py-3 font-bold">Descripción</th>
                <th className="px-3 py-3 font-bold">Grupos musculares</th>
                <th className="px-3 py-3 font-bold">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {visibleExercises.map((exercise) => (
                <tr key={exercise.id} className="border-b border-[#f0f4f3] last:border-0">
                  <td className="px-3 py-4 font-semibold text-[#315652]">{exercise.name}</td>
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedExercise(exercise)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008d82] transition hover:text-[#004c4c]"
                    >
                      <BookOpen size={15} />
                      Leer descripción
                    </button>
                  </td>
                  <td className="px-3 py-4 text-[#718783]">
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.muscleGroups.map((group) => <span key={group.id} className="rounded-full bg-[#edf7f5] px-2.5 py-1 text-xs text-[#39716b]">{group.name}</span>)}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[#718783]">{exercise.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-[#91a29f]">No hay ejercicios que coincidan con la búsqueda.</div>
      )}

      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedExercise(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="exercise-description-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="exercise-description-title"
                  className="text-lg font-bold text-[#214c48]"
                >
                  {selectedExercise.name}
                </h3>

                <p className="mt-1 text-xs text-[#91a29f]">
                  Descripción del ejercicio
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                aria-label="Cerrar descripción"
                className="rounded-lg p-2 text-[#718783] transition hover:bg-[#f0f5f4]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-[#f8fbfa] p-4">
              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-[#52716d]">
                {selectedExercise.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedExercise(null)}
              className="mt-5 w-full rounded-lg bg-[#004c4c] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#00645d]"
            >
              Cerrar
            </button>
          </section>
        </div>
      )}

    </section>
  )
}

export default ExercisesSection
