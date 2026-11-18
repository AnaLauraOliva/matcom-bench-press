import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

import { GetTrainerDashboard } from '../../application/use-cases/trainer/GetTrainerDashboard'
import { MockTrainerDashboardRepository } from '../../infrastructure/repositories/MockTrainerDashboardRepository'
import type {
  Exercise,
  TrainingRoutine,
  TrainerDashboard,
} from '../../domain/entities/TrainerDashboard'
import { useAuthSession } from '../contexts/useAuthSession'

type TrainerSection =
  | 'overview'
  | 'exercises'
  | 'generate'
  | 'routines'
  | 'reports'
  | 'review'

const dashboardRepository = new MockTrainerDashboardRepository()
const getTrainerDashboard = new GetTrainerDashboard(dashboardRepository)

/**
 * Convierte el estado de una rutina en una etiqueta visual consistente.
 */
function RoutineStatus({ status }: { status: TrainingRoutine['status'] }) {
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

/**
 * Muestra el panel de trabajo común a entrenadores y jefes de sala.
 * Las funciones de supervisión se habilitan exclusivamente para HEAD_TRAINER.
 */
function TrainerPage() {
  const { session, logout } = useAuthSession()
  const isHeadTrainer = session?.user.role === 'HEAD_TRAINER'

  const [section, setSection] = useState<TrainerSection>('overview')
  const [dashboard, setDashboard] = useState<TrainerDashboard | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reviewedRoutineIds, setReviewedRoutineIds] = useState<number[]>([])
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    let isMounted = true

    getTrainerDashboard.execute()
      .then((data) => {
        if (isMounted) setDashboard(data)
      })
      .catch(() => {
        if (isMounted) setLoadError('No se pudo cargar la información del panel.')
      })

    return () => {
      isMounted = false
    }
  }, [])

  const navigation = [
    { id: 'overview' as const, label: 'Resumen', icon: LayoutDashboard },
    { id: 'exercises' as const, label: 'Banco de ejercicios', icon: Dumbbell },
    { id: 'generate' as const, label: 'Generar rutina', icon: Sparkles },
    { id: 'routines' as const, label: 'Rutinas', icon: BookOpen },
    { id: 'reports' as const, label: 'Reportes', icon: BarChart3 },
  ]

  const visibleExercises = useMemo(() => {
    const exercises = dashboard?.exercises ?? []
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase()

    if (!normalizedSearch) return exercises

    return exercises.filter((exercise) =>
      `${exercise.name} ${exercise.muscleGroup} ${exercise.type} ${exercise.intensity}`
        .toLocaleLowerCase()
        .includes(normalizedSearch),
    )
  }, [dashboard?.exercises, searchTerm])

  const selectSection = (nextSection: TrainerSection) => {
    setSection(nextSection)
    setMobileMenuOpen(false)
    setGenerated(false)
  }

  const markRoutineAsReviewed = (routineId: number) => {
    setReviewedRoutineIds((current) =>
      current.includes(routineId) ? current : [...current, routineId],
    )
  }

  /**
   * Incorpora un ejercicio a los datos locales de demostración.
   * La persistencia definitiva se implementará mediante el backend.
   */
  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    setDashboard((current) => {
      if (!current) return current
      const nextId = Math.max(0, ...current.exercises.map((item) => item.id)) + 1
      return {
        ...current,
        exercises: [...current.exercises, { ...exercise, id: nextId }],
        summary: {
          ...current.summary,
          registeredExercises: current.summary.registeredExercises + 1,
        },
      }
    })
  }

  const pageTitles: Record<TrainerSection, { title: string; description: string }> = {
    overview: {
      title: 'Resumen',
      description: 'Aquí tienes un vistazo general de tu actividad.',
    },
    exercises: {
      title: 'Banco de ejercicios',
      description: 'Consulta los ejercicios disponibles para crear tus rutinas.',
    },
    generate: {
      title: 'Generar rutina',
      description: 'Define los criterios para confeccionar una nueva rutina.',
    },
    routines: {
      title: 'Rutinas',
      description: 'Consulta las rutinas creadas para tus programas de entrenamiento.',
    },
    reports: {
      title: 'Reportes de progreso',
      description: 'Da seguimiento al rendimiento y evolución de los clientes.',
    },
    review: {
      title: 'Validación de rutinas',
      description: 'Revisa las rutinas pendientes de aprobación de tus programas autorizados.',
    },
  }

  const title = pageTitles[section]

  return (
    <div className="min-h-screen bg-[#f5f8f7] text-[#173f3d]">
      <div className="flex min-h-screen">
        {mobileMenuOpen && (
          <button
            aria-label="Cerrar menú"
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#e1eae8] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-[82px] items-center gap-3 border-b border-[#edf2f1] px-6">
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
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-5 pb-3 pt-7">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#8aa09d]">Espacio de trabajo</p>
          </div>

          <nav className="flex-1 space-y-1 px-3" aria-label="Navegación del entrenador">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = section === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => selectSection(item.id)}
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
                  onClick={() => selectSection('review')}
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

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-[#e5edeb] bg-white/95 px-5 backdrop-blur sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                aria-label="Abrir menú"
                className="rounded-lg p-2 text-[#52716d] hover:bg-[#f1f7f6] lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={21} />
              </button>
              <div>
                <p className="text-xs font-medium text-[#8aa09d]">Panel del entrenador</p>
                <p className="text-sm font-bold text-[#315652] sm:text-base">{title.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-[#edf7f5] px-3 py-1.5 text-xs font-semibold text-[#08796f] sm:inline-flex">
                {isHeadTrainer ? 'Jefe de sala' : 'Entrenador'}
              </span>
              <div className="grid size-9 place-items-center rounded-full bg-[#004c4c] text-sm font-bold text-white">
                {session?.user.name.slice(0, 1).toUpperCase() ?? 'E'}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[1.6px] text-[#00a699]">
                {section === 'review' ? 'Control de calidad' : 'Tu espacio de trabajo'}
              </p>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#124744] sm:text-[30px]">
                    {section === 'overview' ? `¡Hola, ${session?.user.name.split(' ')[0] ?? 'entrenador'}!` : title.title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718783]">{title.description}</p>
                </div>
              </div>
            </div>

            {loadError && (
              <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loadError}
              </div>
            )}

            {!dashboard ? (
              <div className="rounded-2xl border border-[#e3ecea] bg-white p-8 text-sm text-[#718783]">
                Cargando información del panel…
              </div>
            ) : (
              <>
                {section === 'overview' && (
                  <OverviewSection
                    dashboard={dashboard}
                    isHeadTrainer={isHeadTrainer}
                    onNavigate={selectSection}
                    pendingReviews={Math.max(0, dashboard.routinesToReview.length - reviewedRoutineIds.length)}
                  />
                )}

                {section === 'exercises' && (
                  <ExercisesSection
                    exercises={visibleExercises}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAddExercise={addExercise}
                  />
                )}

                {section === 'generate' && (
                  <GenerateSection
                    exercises={dashboard.exercises}
                    generated={generated}
                    onGenerate={() => setGenerated(true)}
                  />
                )}

                {section === 'routines' && (
                  <RoutinesSection routines={dashboard.recentRoutines} />
                )}

                {section === 'reports' && <ReportsSection />}

                {section === 'review' && isHeadTrainer && (
                  <ReviewSection
                    routines={dashboard.routinesToReview}
                    reviewedIds={reviewedRoutineIds}
                    onApprove={markRoutineAsReviewed}
                  />
                )}
              </>
            )}

            <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#e4ecea] pt-5 text-xs text-[#91a29f]">
              <span>© 2026 MatCom Bench Press · Plataforma de gestión de entrenamiento</span>
              <span>Panel de trabajo</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
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
    { label: 'Clientes activos', value: dashboard.summary.activeClients, icon: Users, note: 'En tus programas' },
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

/** Botón reutilizable para los accesos rápidos del resumen. */
function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Dumbbell
  label: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#52716d] transition hover:bg-[#f1f7f6] hover:text-[#00645d]">
      <span className="grid size-8 place-items-center rounded-lg bg-[#edf7f5] text-[#008d82]"><Icon size={16} /></span>
      <span className="flex-1">{label}</span>
      <ArrowRight size={15} className="text-[#9bb2ae]" />
    </button>
  )
}

/** Permite explorar el banco de ejercicios y filtrar sus registros. */
function ExercisesSection({
  exercises,
  searchTerm,
  onSearchChange,
  onAddExercise,
}: {
  exercises: Exercise[]
  searchTerm: string
  onSearchChange: (value: string) => void
  onAddExercise: (exercise: Omit<Exercise, 'id'>) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('Piernas')
  const [type, setType] = useState<Exercise['type']>('Fuerza')
  const [intensity, setIntensity] = useState<Exercise['intensity']>('Media')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    onAddExercise({ name: trimmedName, muscleGroup, type, intensity })
    setName('')
    setShowForm(false)
  }

  return (
    <section className="rounded-2xl border border-[#e3ecea] bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-[#214c48]">Ejercicios registrados</h2>
          <p className="mt-1 text-xs text-[#91a29f]">{exercises.length} ejercicios encontrados</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative block w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a29f]" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar ejercicio..."
              className="w-full rounded-xl border border-[#dce8e7] bg-[#fbfdfc] py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-[#a3b2af] focus:border-[#00a699] focus:ring-2 focus:ring-[#00a699]/10"
            />
          </label>
          <button
            onClick={() => setShowForm((current) => !current)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#004c4c] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#00645d]"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancelar' : 'Añadir ejercicio'}
          </button>
        </div>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-xl border border-[#dce8e7] bg-[#f8fbfa] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#52716d] sm:col-span-2">
            Nombre del ejercicio
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Press de banca" className="mt-2 w-full rounded-lg border border-[#dce8e7] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00a699]" />
          </label>
          <label className="text-xs font-semibold text-[#52716d]">
            Grupo muscular
            <input required value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)} className="mt-2 w-full rounded-lg border border-[#dce8e7] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00a699]" />
          </label>
          <label className="text-xs font-semibold text-[#52716d]">
            Tipo
            <select value={type} onChange={(event) => setType(event.target.value as Exercise['type'])} className="mt-2 w-full rounded-lg border border-[#dce8e7] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00a699]">
              <option>Fuerza</option><option>Cardio</option><option>Flexibilidad</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-[#52716d]">
            Intensidad
            <select value={intensity} onChange={(event) => setIntensity(event.target.value as Exercise['intensity'])} className="mt-2 w-full rounded-lg border border-[#dce8e7] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00a699]">
              <option>Baja</option><option>Media</option><option>Alta</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#008d82] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#00776e]">
              <Plus size={15} /> Guardar ejercicio
            </button>
          </div>
        </form>
      )}
      {exercises.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf2f1] text-[11px] uppercase tracking-wider text-[#91a29f]">
                <th className="px-3 py-3 font-bold">Ejercicio</th>
                <th className="px-3 py-3 font-bold">Grupo muscular</th>
                <th className="px-3 py-3 font-bold">Tipo</th>
                <th className="px-3 py-3 font-bold">Intensidad</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise) => (
                <tr key={exercise.id} className="border-b border-[#f0f4f3] last:border-0">
                  <td className="px-3 py-4 font-semibold text-[#315652]">{exercise.name}</td>
                  <td className="px-3 py-4 text-[#718783]">{exercise.muscleGroup}</td>
                  <td className="px-3 py-4 text-[#718783]">{exercise.type}</td>
                  <td className="px-3 py-4"><IntensityLabel intensity={exercise.intensity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-[#91a29f]">No hay ejercicios que coincidan con la búsqueda.</div>
      )}
    </section>
  )
}

/** Etiqueta visual para los niveles de intensidad de los ejercicios. */
function IntensityLabel({ intensity }: { intensity: Exercise['intensity'] }) {
  const classes = {
    Baja: 'bg-emerald-50 text-emerald-700',
    Media: 'bg-amber-50 text-amber-700',
    Alta: 'bg-rose-50 text-rose-700',
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[intensity]}`}>{intensity}</span>
}

/** Presenta los criterios básicos para iniciar la generación de una rutina. */
function GenerateSection({
  exercises,
  generated,
  onGenerate,
}: {
  exercises: Exercise[]
  generated: boolean
  onGenerate: () => void
}) {
  const [program, setProgram] = useState('Acondicionamiento físico')
  const [exerciseCount, setExerciseCount] = useState('8')
  const [intensity, setIntensity] = useState('Media')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Fuerza', 'Cardio'])

  const toggleType = (type: string) => {
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    )
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_0.8fr]">
      <section className="rounded-2xl border border-[#e3ecea] bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[#eaf5f3] text-[#008d82]"><Sparkles size={21} /></span>
          <div>
            <h2 className="font-bold text-[#214c48]">Criterios de generación</h2>
            <p className="mt-1 text-xs text-[#91a29f]">Configura los parámetros de la rutina</p>
          </div>
        </div>
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#52716d]">Programa de entrenamiento</span>
            <select value={program} onChange={(event) => setProgram(event.target.value)} className="w-full rounded-xl border border-[#dce8e7] bg-white px-3 py-3 text-sm text-[#315652] outline-none focus:border-[#00a699]">
              <option>Acondicionamiento físico</option>
              <option>Bienestar integral</option>
              <option>Preparación deportiva</option>
            </select>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#52716d]">Cantidad de ejercicios</span>
              <input type="number" min="1" max="30" value={exerciseCount} onChange={(event) => setExerciseCount(event.target.value)} className="w-full rounded-xl border border-[#dce8e7] px-3 py-3 text-sm outline-none focus:border-[#00a699]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#52716d]">Intensidad predominante</span>
              <select value={intensity} onChange={(event) => setIntensity(event.target.value)} className="w-full rounded-xl border border-[#dce8e7] bg-white px-3 py-3 text-sm outline-none focus:border-[#00a699]">
                <option>Baja</option><option>Media</option><option>Alta</option>
              </select>
            </label>
          </div>
          <div>
            <span className="mb-3 block text-sm font-semibold text-[#52716d]">Tipos de ejercicios</span>
            <div className="flex flex-wrap gap-2">
              {['Fuerza', 'Cardio', 'Flexibilidad'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${selectedTypes.includes(type) ? 'border-[#8ccdc5] bg-[#eaf5f3] text-[#00645d]' : 'border-[#dce8e7] text-[#718783] hover:bg-[#f7faf9]'}`}
                >
                  {selectedTypes.includes(type) && <Check size={14} className="mr-1 inline" />}
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={!exerciseCount || Number(exerciseCount) < 1 || selectedTypes.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#004c4c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#00645d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Sparkles size={17} /> Preparar generación
          </button>
          {generated && (
            <div role="status" className="rounded-xl border border-[#cce8e2] bg-[#f0faf7] p-4 text-sm text-[#176b60]">
              <p className="font-bold">Criterios preparados</p>
              <p className="mt-1 leading-5">Programa: {program}. Se configuraron {exerciseCount} ejercicios, intensidad {intensity.toLowerCase()} y tipos: {selectedTypes.join(', ')}.</p>
              <p className="mt-2 text-xs text-[#658c85]">La generación real se conectará cuando esté disponible el servicio del backend.</p>
            </div>
          )}
        </div>
      </section>

      <aside className="rounded-2xl border border-[#e3ecea] bg-white p-6">
        <div className="flex items-center gap-2 text-[#008d82]"><Filter size={17} /><h3 className="font-bold text-[#214c48]">Banco disponible</h3></div>
        <p className="mt-2 text-sm leading-6 text-[#829693]">La rutina se confeccionará a partir de los ejercicios registrados y de los criterios que definas.</p>
        <div className="mt-5 space-y-3">
          {['Fuerza', 'Cardio', 'Flexibilidad'].map((type) => {
            const count = exercises.filter((exercise) => exercise.type === type).length
            return (
              <div key={type} className="flex items-center justify-between rounded-xl bg-[#f6faf9] px-4 py-3">
                <span className="text-sm font-semibold text-[#52716d]">{type}</span>
                <span className="text-sm font-bold text-[#007d73]">{count}</span>
              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}

/** Tabla reutilizable para mostrar las rutinas recientes o disponibles. */
function RoutineTable({ routines }: { routines: TrainingRoutine[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
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

/** Presenta el estado inicial de la sección de reportes de progreso. */
function ReportsSection() {
  return (
    <section className="rounded-2xl border border-[#e3ecea] bg-white p-8 sm:p-10">
      <div className="mx-auto max-w-lg py-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eaf5f3] text-[#008d82]"><BarChart3 size={26} /></span>
        <h2 className="mt-5 text-xl font-bold text-[#214c48]">Reportes de progreso</h2>
        <p className="mt-2 text-sm leading-6 text-[#829693]">
          En esta sección podrás consultar el rendimiento de los clientes, comparar resultados y revisar la evolución de los programas.
        </p>
        <span className="mt-5 inline-flex rounded-full bg-[#f1f6f5] px-3 py-1.5 text-xs font-semibold text-[#78908d]">Pendiente de integración con el backend</span>
      </div>
    </section>
  )
}

/** Permite al jefe de sala revisar y aprobar las rutinas pendientes. */
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

export default TrainerPage
