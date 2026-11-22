
import { ClipboardCheck, Dumbbell, LogOut, Sparkles, X } from 'lucide-react'

import type { AuthSession } from '../../../application/dtos/auth'
import type { TrainerDashboard } from '../../../domain/entities/TrainerDashboard'

import { TRAINER_NAVIGATION, type TrainerSection } from './trainerNavigation'

type TrainerSidebarProps = {
  section: TrainerSection
  isMenuOpen: boolean
  onSelectSection: (section: TrainerSection) => void
  onCloseMenu: () => void
  isHeadTrainer: boolean
  dashboard: TrainerDashboard | null
  reviewedRoutineIds: number[]
  session: AuthSession | null
  logout: () => void
}

/** Barra lateral del entrenador: navegación, bienvenida y perfil activo. */
function TrainerSidebar({
  section,
  isMenuOpen,
  onSelectSection,
  onCloseMenu,
  isHeadTrainer,
  dashboard,
  reviewedRoutineIds,
  session,
  logout,
}: TrainerSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-67.5 flex-col border-r border-[#e1eae8] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex h-20.5 items-center gap-3 border-b border-[#edf2f1] px-6">
        <div className="grid size-10 place-items-center rounded-xl bg-[#004c4c] text-white">
          <Dumbbell size={21} />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight text-[#004c4c]">MatCom Bench Press</p>
          <p className="text-[11px] font-medium tracking-wide text-[#78908d]">GESTIÓN DE ENTRENAMIENTO</p>
        </div>
        <button
          aria-label="Cerrar menú"
          className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          onClick={onCloseMenu}
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-5 pb-3 pt-7">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#8aa09d]">Espacio de trabajo</p>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Navegación del entrenador">
        {TRAINER_NAVIGATION.map((item) => {
          const Icon = item.icon
          const active = section === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active ? 'bg-[#e8f4f2] text-[#00645d]' : 'text-[#607976] hover:bg-[#f4f8f7] hover:text-[#004c4c]'}`}
            >
              <Icon size={18} strokeWidth={active ? 2.3 : 1.9} />
              {item.label}
              {active && <span className="ml-auto size-1.5 rounded-full bg-[#00a699]" />}
            </button>
          )
        })}

        {isHeadTrainer && (
          <>
            <div className="px-3 pb-1 pt-7 text-[10px] font-bold uppercase tracking-[1.5px] text-[#8aa09d]">
              Supervisión
            </div>
            <button
              onClick={() => onSelectSection('review')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${section === 'review' ? 'bg-[#e8f4f2] text-[#00645d]' : 'text-[#607976] hover:bg-[#f4f8f7] hover:text-[#004c4c]'}`}
            >
              <ClipboardCheck size={18} />
              Validar rutinas
              {(dashboard?.routinesToReview.length ?? 0) > 0 && (
                <span className="ml-auto rounded-full bg-[#fff2dc] px-2 py-0.5 text-[10px] font-bold text-[#9a6415]">
                  {Math.max(0, (dashboard?.routinesToReview.length ?? 0) - reviewedRoutineIds.length)}
                </span>
              )}
            </button>
          </>
        )}
      </nav>

      <div className="m-4 rounded-2xl bg-[#f1f7f6] p-4">
        <div className="mb-2 flex items-center gap-2 text-[#00766d]">
          <Sparkles size={16} />
          <span className="text-xs font-bold">MatCom Bench Press</span>
        </div>
        <p className="text-xs leading-5 text-[#69817e]">
          Organiza tus ejercicios y crea planes de entrenamiento de forma sencilla.
        </p>
      </div>

      <div className="border-t border-[#edf2f1] p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d9eeeb] text-sm font-bold text-[#00645d]">
            {session?.user.name.slice(0, 1).toUpperCase() ?? 'E'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#244c49]">{session?.user.name}</p>
            <p className="text-xs text-[#829693]">{isHeadTrainer ? 'Jefe de sala' : 'Entrenador'}</p>
          </div>
          <button
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            onClick={logout}
            className="rounded-lg p-2 text-[#78908d] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default TrainerSidebar
