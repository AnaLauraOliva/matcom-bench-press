
import type { MuscleGroup } from '../../../domain/entities/Exercise'

type MuscleGroupGridProps = {
  muscleGroups: MuscleGroup[]
  selectedIds: number[]
  onToggle: (groupId: number) => void
}

/** Cuadrícula de grupos musculares con selección múltiple. */
function MuscleGroupGrid({ muscleGroups, selectedIds, onToggle }: MuscleGroupGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#dce8e7] bg-white p-3 sm:grid-cols-3">
      {muscleGroups.map((group) => {
        const selected = selectedIds.includes(group.id)
        return (
          <label
            key={group.id}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 font-medium transition ${selected ? 'border-[#00a699] bg-[#eaf6f4] text-[#00645d]' : 'border-[#edf2f1] text-[#607976] hover:border-[#b2d8d8]'}`}
          >
            <input type="checkbox" checked={selected} onChange={() => onToggle(group.id)} className="size-4 accent-[#008d82]" />
            <span>{group.name}</span>
          </label>
        )
      })}
    </div>
  )
}

export default MuscleGroupGrid
