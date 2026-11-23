
import { Check, CheckCircle2 } from 'lucide-react'

import type { TrainingRoutine } from '../../../domain/entities/TrainerDashboard'
import { RoutineStatus } from './RoutineTable'

/**
 * Permite al jefe de sala revisar y aprobar las rutinas pendientes.
 */
function ReviewSection({
  routines,
  reviewedIds,
  onApprove,
}: {
  routines: TrainingRoutine[]
  reviewedIds: number[]
  onApprove: (id: number) => void
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#e3ecea] bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-bold text-[#214c48]">Rutinas pendientes de revisión</h2>
          <p className="mt-1 text-xs text-[#91a29f]">Verifica las propuestas antes de aprobarlas</p>
        </div>
        {routines.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#91a29f]">No hay rutinas pendientes de validación.</p>
        ) : (
          <div className="space-y-3">
            {routines.map((routine) => {
              const reviewed = reviewedIds.includes(routine.id)
              return (
                <article key={routine.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[#edf2f1] p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#315652]">{routine.name}</h3>
                      {reviewed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} /> Revisada (vista previa)</span>
                      ) : <RoutineStatus status={routine.status} />}
                    </div>
                    <p className="mt-2 text-xs text-[#829693]">{routine.program} · Creada por {routine.author} · {routine.updatedAt}</p>
                  </div>
                  <button
                    onClick={() => onApprove(routine.id)}
                    disabled={reviewed}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#eaf5f3] px-4 py-2.5 text-xs font-bold text-[#00645d] transition hover:bg-[#d9eeeb] disabled:cursor-default disabled:opacity-60"
                  >
                    <Check size={15} /> {reviewed ? 'Revisada' : 'Marcar como revisada'}
                  </button>
                </article>
              )
            })}
          </div>
        )}
        <p className="mt-5 rounded-xl bg-[#f6faf9] p-3 text-xs leading-5 text-[#829693]">
          Esta interacción es una demostración visual: la aprobación definitiva, las observaciones y su persistencia deben conectarse al servicio correspondiente del backend.
        </p>
      </div>
    </section>
  )
}

export default ReviewSection
