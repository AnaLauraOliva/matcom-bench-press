
import type { GeneratedRoutine } from '../../../domain/entities/GeneratedRoutine'

/**
 * Muestra la rutina generada dividida por los bloques estructurales.
 */
function GeneratedRoutinePanel({ routine }: { routine: GeneratedRoutine }) {
  return (
    <div role="status" className="rounded-xl border border-[#cce8e2] bg-[#f0faf7] p-4">
      <p className="font-bold text-[#176b60]">{routine.name}</p>
      <p className="mt-1 text-xs text-[#658c85]">Programa: {routine.program || 'personalizada'}</p>
      <div className="mt-3 space-y-3">
        {routine.blocks.map((block, index) => (
          <div key={`${block.kind}-${index}`} className="rounded-lg border border-[#dce8e7] bg-white px-3.5 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[#315652]">{block.title}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#91a29f]">{block.kind}</span>
            </div>
            {block.exercises.length > 0 && (
              <ul className="mt-2 space-y-1">
                {block.exercises.map((entry) => {
                  const exercise = routine.exercises.find((item) => item.id === entry.id)
                  return (
                    <li key={entry.id} className="text-xs text-[#52716d]">
                      <span>{exercise?.name ?? `Ejercicio ${entry.id}`}</span>
                      {entry.repetitions != null && <span className="float-right text-[#91a29f]">{entry.repetitions} rep.</span>}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GeneratedRoutinePanel
