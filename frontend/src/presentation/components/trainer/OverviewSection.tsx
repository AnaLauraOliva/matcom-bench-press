
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Dumbbell,
  Sparkles,
} from 'lucide-react'

import type { TrainerDashboard } from '../../../domain/entities/TrainerDashboard'
import RoutineTable from './RoutineTable'
import type { TrainerSection } from './trainerNavigation'

type QuickActionProps = {
  icon: typeof Dumbbell
  label: string
  onClick: () => void
}

/** Botón reutilizable para los accesos rápidos del resumen. */
function QuickAction({ icon: Icon, label, onClick }: QuickActionProps) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#52716d] transition hover:bg-[#f1f7f6] hover:text-[#00645d]">
      <span className="grid size-8 place-items-center rounded-lg bg-[#edf7f5] text-[#008d82]"><Icon size={16} /></span>
      <span className="flex-1">{label}</span>
      <ArrowRight size={15} className="text-[#9bb2ae]" />
    </button>
  )
}

/** Presenta los indicadores y accesos directos del entrenador. */
function OverviewSection({
  dashboard,
  isHeadTrainer,
  onNavigate,
  pendingReviews,
}: {
  dashboard: TrainerDashboard
  isHeadTrainer: boolean
  onNavigate: (section: TrainerSection) => void
  pendingReviews: number
}) {
  const metrics = [
    { label: 'Clientes activos', value: dashboard.summary.activeClients, icon: Dumbbell, note: 'En tus programas' },
    { label: 'Rutinas creadas', value: dashboard.summary.createdRoutines, icon: BookOpen, note: 'En total' },
    { label: 'Ejercicios disponibles', value: dashboard.summary.registeredExercises, icon: Dumbbell, note: 'En el banco' },
    { label: 'Clientes pendientes', value: dashboard.summary.pendingClients, icon: ClipboardCheck, note: 'En espera de nueva rutina' },
  ]

  return (
    <div className="space-y-7">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article key={metric.label} className="rounded-2xl border border-[#e3ecea] bg-white p-5 shadow-[0_3px_14px_rgba(0,76,76,0.025)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78908d]">{metric.label}</span>
                <span className="grid size-9 place-items-center rounded-xl bg-[#eaf5f3] text-[#008d82]">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#164b47]">{metric.value}</p>
              <p className="mt-1 text-xs text-[#91a29f]">{metric.note}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="overflow-hidden rounded-2xl bg-[#004c4c] p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#b7e8e1]">
                <Sparkles size={13} /> PLANIFICACIÓN INTELIGENTE
              </span>
              <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-[27px]">Diseña tu próxima rutina</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#c2d9d6]">
                Selecciona ejercicios y establece criterios de intensidad, grupos musculares y tipos de actividad para confeccionar un plan.
              </p>
              <button
                onClick={() => onNavigate('generate')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#00534e] transition hover:bg-[#e8f4f2]"
              >
                Comenzar <ArrowRight size={16} />
              </button>
            </div>
            <div className="hidden size-16 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#b2d8d8] sm:grid">
              <Dumbbell size={31} />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#e3ecea] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#214c48]">Accesos rápidos</h2>
              <p className="mt-1 text-xs text-[#91a29f]">Tareas frecuentes</p>
            </div>
            <ArrowDownRight size={18} className="text-[#9bb2ae]" />
          </div>
          <div className="mt-5 space-y-2">
            <QuickAction icon={Dumbbell} label="Consultar ejercicios" onClick={() => onNavigate('exercises')} />
            <QuickAction icon={BookOpen} label="Ver rutinas" onClick={() => onNavigate('routines')} />
            <QuickAction icon={BarChart3} label="Consultar reportes" onClick={() => onNavigate('reports')} />
            {isHeadTrainer && (
              <QuickAction icon={ClipboardCheck} label={`Validar rutinas (${pendingReviews})`} onClick={() => onNavigate('review')} />
            )}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-[#e3ecea] bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-[#214c48]">Actividad reciente</h2>
            <p className="mt-1 text-xs text-[#91a29f]">Últimas rutinas registradas</p>
          </div>
          <button onClick={() => onNavigate('routines')} className="inline-flex items-center gap-1 text-xs font-bold text-[#008d82] hover:text-[#005c55]">
            Ver todas <ArrowRight size={14} />
          </button>
        </div>
        <RoutineTable routines={dashboard.recentRoutines.slice(0, 3)} />
      </section>
    </div>
  )
}

export default OverviewSection
