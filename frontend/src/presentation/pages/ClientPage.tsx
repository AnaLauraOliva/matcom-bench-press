import { useAuthSession } from '../contexts/useAuthSession'

function ClientPage() {
  const { session, logout } = useAuthSession()

  return (
    <main>
      <h1>Panel del cliente</h1>
      <p>Bienvenido, {session?.user.name}</p>

      <button onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  )
}

export default ClientPage