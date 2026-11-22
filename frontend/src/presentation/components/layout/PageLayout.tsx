import type { ReactNode } from 'react'

type PageLayoutProps = {
  /** Contenido del encabezado sticky: título, descripción, acciones, etc. */
  header?: ReactNode
  /** Contenido del pie de página. */
  footer?: ReactNode
  children?: ReactNode
}

/**
 * Estructura compartida de las páginas: contenedor con fondo, encabezado
 * fijo (`sticky top-0`), separador bajo el título y espacio para el pie.
 */
function PageLayout({ header, footer, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f8f7] text-[#173f3d]">
      {header && (
        <header className="sticky top-0 z-20 flex min-h-[82px] items-center justify-between gap-4 border-b border-[#e5edeb] bg-white/95 px-5 py-2 backdrop-blur sm:px-8 lg:px-10">
          {header}
        </header>
      )}

      {children}

      {footer}
    </div>
  )
}

export default PageLayout
