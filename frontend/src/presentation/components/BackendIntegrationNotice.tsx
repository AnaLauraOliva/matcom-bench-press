import { CheckCircle2 } from 'lucide-react'

/**
 * Notificación para indicar que el trabajo local está listo y solo queda
 * verificar la integración con el servicio del backend.
 */
export default function BackendIntegrationNotice() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <CheckCircle2
        size={22}
        className="mt-0.5 shrink-0 text-emerald-600"
      />

      <div>
        <h3 className="text-sm font-bold text-emerald-700">
          Funcionalidad completa
        </h3>

        <p className="mt-1 text-sm text-emerald-600">
          Solo queda verificar la integración con el servicio del backend.
        </p>
      </div>
    </div>
  )
}
