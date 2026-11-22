
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { GetTrainerDashboard } from '../../application/use-cases/trainer/GetTrainerDashboard'
import { CreateExercise } from '../../application/use-cases/exercises/CreateExercise'
import { GetExercises } from '../../application/use-cases/exercises/GetExercises'
import { GetMuscleGroups } from '../../application/use-cases/exercises/GetMuscleGroups'
import { MockTrainerDashboardRepository } from '../../infrastructure/repositories/MockTrainerDashboardRepository'
import { createExerciseRepository } from '../../infrastructure/repositories/exerciseRepositoryFactory'
import type { TrainerDashboard } from '../../domain/entities/TrainerDashboard'
import type { CreateExerciseInput, MuscleGroup } from '../../domain/entities/Exercise'
import { useAuthSession } from '../contexts/useAuthSession'

import PageLayout from '../components/layout/PageLayout'
import TrainerSidebar from '../components/trainer/TrainerSidebar'
import type { TrainerSection } from '../components/trainer/trainerNavigation'
import OverviewSection from '../components/trainer/OverviewSection'
import ExercisesSection from '../components/trainer/ExercisesSection'
import GenerateSection from '../components/trainer/GenerateSection'
import RoutinesSection from '../components/trainer/RoutinesSection'
import ReportsSection from '../components/trainer/ReportsSection'
import ReviewSection from '../components/trainer/ReviewSection'

import WorkInProgressNotice from '../components/WorkInProgressNotice'
import BackendIntegrationNotice from '../components/BackendIntegrationNotice'

const dashboardRepository = new MockTrainerDashboardRepository()
const getTrainerDashboard = new GetTrainerDashboard(dashboardRepository)
const exerciseRepository = createExerciseRepository()
const getExercises = new GetExercises(exerciseRepository)
const getMuscleGroups = new GetMuscleGroups(exerciseRepository)
const createExercise = new CreateExercise(exerciseRepository)

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
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [exerciseLoading, setExerciseLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reviewedRoutineIds, setReviewedRoutineIds] = useState<number[]>([])

  useEffect(() => {
    let isMounted = true

    Promise.all([
      getTrainerDashboard.execute(),
      getExercises.execute(),
      getMuscleGroups.execute(),
    ])
      .then(([data, exercises, groups]) => {
        if (!isMounted) return
        setDashboard({
          ...data,
          exercises,
          summary: { ...data.summary, registeredExercises: exercises.length },
        })
        setMuscleGroups(groups)
        setExerciseLoading(false)
      })
      .catch(() => {
        if (isMounted) {
          setLoadError('No se pudo cargar la información del panel o del banco de ejercicios.')
          setExerciseLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

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

  const selectSection = (nextSection: TrainerSection) => {
    setSection(nextSection)
    setMobileMenuOpen(false)
  }

  const markRoutineAsReviewed = (routineId: number) => {
    setReviewedRoutineIds((current) =>
      current.includes(routineId) ? current : [...current, routineId],
    )
  }

  /** Registra el ejercicio mediante el adaptador seleccionado (mock o HTTP). */
  const addExercise = async (input: CreateExerciseInput) => {
    const exercise = await createExercise.execute(input)
    setDashboard((current) => {
      if (!current) return current
      const exercises = [...current.exercises, exercise]
      return {
        ...current,
        exercises,
        summary: { ...current.summary, registeredExercises: exercises.length },
      }
    })
  }

  return (
    <PageLayout
      header={
        <>
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
        </>
      }
      footer={
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#e4ecea] pt-5 text-xs text-[#91a29f]">
          <span>© 2026 MatCom Bench Press · Plataforma de gestión de entrenamiento</span>
          <span>Panel de trabajo</span>
        </footer>
      }
    >
      <div className="flex min-h-screen">
        <TrainerSidebar
          section={section}
          isMenuOpen={mobileMenuOpen}
          onSelectSection={selectSection}
          onCloseMenu={() => setMobileMenuOpen(false)}
          isHeadTrainer={isHeadTrainer}
          dashboard={dashboard}
          reviewedRoutineIds={reviewedRoutineIds}
          session={session}
          logout={logout}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            {section != "exercises" && section != "generate" ? (
              <WorkInProgressNotice />
            ) : (
              <BackendIntegrationNotice />
            )}
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

            {loadError && (
              <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loadError}
              </div>
            )}

            {!dashboard ? (
              <div role={loadError ? 'alert' : undefined} className="rounded-2xl border border-[#e3ecea] bg-white p-8 text-sm text-[#718783]">
                {loadError ? 'No se pudo cargar el panel. Revisa la conexión con el servidor e inténtalo de nuevo.' : 'Cargando información del panel…'}
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
                    exercises={dashboard.exercises}
                    muscleGroups={muscleGroups}
                    isLoading={exerciseLoading}
                    onAddExercise={addExercise}
                  />
                )}

                {section === 'generate' && (
                  <GenerateSection
                    programs={dashboard.programs}
                    exercises={dashboard.exercises}
                    muscleGroups={muscleGroups}
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
          </div>
        </main>
      </div>
    </PageLayout>
  )
}

export default TrainerPage
