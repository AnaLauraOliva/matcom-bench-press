
import { useAuthSession } from '../contexts/useAuthSession'
import PageLayout from '../components/layout/PageLayout'

/** Panel del cliente con acceso a su sesión y cierre de sesión. */
function ClientPage() {
  const { session, logout } = useAuthSession()

  return (
    <PageLayout
      header={
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#8aa09d]">Panel del cliente</p>
          <p className="text-sm font-bold text-[#315652] sm:text-base">Bienvenido, {session?.user.name}</p>
        </div>
      }
    >
      <div className="mx-auto max-w-360 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <button onClick={logout} className="rounded-lg border border-[#dce8e7] px-4 py-2.5 text-sm font-bold text-[#315652] transition hover:bg-[#f4f8f7]">
          Cerrar sesión
        </button>
      </div>
    </PageLayout>
  )
}

export default ClientPage
