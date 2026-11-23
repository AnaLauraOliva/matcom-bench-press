import {
  BarChart3,
  BicepsFlexed,
  BookOpen,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'

export type TrainerSection =
  | 'overview'
  | 'exercises'
  | 'generate'
  | 'routines'
  | 'reports'
  | 'review'

/** Elementos de la navegación lateral del entrenador. */
export const TRAINER_NAVIGATION = [
  { id: 'overview' as const, label: 'Resumen', icon: LayoutDashboard },
  { id: 'exercises' as const, label: 'Banco de ejercicios', icon: BicepsFlexed },
  { id: 'generate' as const, label: 'Generar rutina', icon: Sparkles },
  { id: 'routines' as const, label: 'Rutinas', icon: BookOpen },
  { id: 'reports' as const, label: 'Reportes', icon: BarChart3 },
]
