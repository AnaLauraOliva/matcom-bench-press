
import type { TrainingRoutine } from '../../../domain/entities/TrainerDashboard'

/** Convierte el estado de una rutina en una etiqueta visual consistente. */
export function RoutineStatus({ status }: { status: TrainingRoutine['status'] }) {
  const styles: Record<TrainingRoutine['status'], string> = {
    Aprobada: 'bg-emerald-50 text-emerald-700',
    Borrador: 'bg-slate-100 text-slate-600',
    'Pendiente de validación': 'bg-amber-50 text-amber-700',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}

/** Tabla reutilizable para mostrar las rutinas recientes o disponibles. */
export default function RoutineTable({ routines }: { routines: TrainingRoutine[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-170 text-left text-sm">
        <thead>
          <tr className="border-b border-[#edf2f1] text-[11px] uppercase tracking-wider text-[#91a29f]">
            <th className="px-3 py-3 font-bold">Rutina</th>
            <th className="px-3 py-3 font-bold">Programa</th>
            <th className="px-3 py-3 font-bold">Creador</th>
            <th className="px-3 py-3 font-bold">Estado</th>
            <th className="px-3 py-3 font-bold">Actualización</th>
          </tr>
        </thead>
        <tbody>
          {routines.map((routine) => (
            <tr key={routine.id} className="border-b border-[#f0f4f3] last:border-0">
              <td className="px-3 py-4 font-semibold text-[#315652]">{routine.name}</td>
              <td className="px-3 py-4 text-[#718783]">{routine.program}</td>
              <td className="px-3 py-4 text-[#718783]">{routine.author}</td>
              <td className="px-3 py-4"><RoutineStatus status={routine.status} /></td>
              <td className="px-3 py-4 text-[#91a29f]">{routine.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
