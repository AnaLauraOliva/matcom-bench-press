import { Construction, AlertTriangle } from 'lucide-react'

export default function WorkInProgressNotice() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <Construction
        size={22}
        className="mt-0.5 shrink-0 text-red-600"
      />

      <div>
        <h3 className="text-sm font-bold text-red-700">
          Trabajo en proceso
        </h3>

        <p className="mt-1 text-sm text-red-600">
          Esta sección se encuentra actualmente en desarrollo.
          Algunas funcionalidades todavía no están disponibles.
        </p>
      </div>

      <AlertTriangle
        size={18}
        className="ml-auto shrink-0 text-red-500"
      />
    </div>
  )
}