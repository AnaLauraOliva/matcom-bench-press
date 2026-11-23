
import type { TrainingRoutine } from '../../../domain/entities/TrainerDashboard'
import RoutineTable from './RoutineTable'

/** Lista las rutinas recientes del entrenador y de su ámbito de programas. */
function RoutinesSection({ routines }: { routines: TrainingRoutine[] }) {
  return (
    <section className="rounded-2xl border border-[#e3ecea] bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-bold text-[#214c48]">Rutinas de tus programas</h2>
        <p className="mt-1 text-xs text-[#91a29f]">Rutinas propias y compartidas en el programa</p>
      </div>
      <RoutineTable routines={routines} />
    </section>
  )
}

export default RoutinesSection
