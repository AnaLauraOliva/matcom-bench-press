
import { BarChart3 } from 'lucide-react'

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

export default ReportsSection
