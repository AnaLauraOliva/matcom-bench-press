import { useAuthSession } from '../contexts/useAuthSession'

function AdminPage() {
  const { session, logout } = useAuthSession()

  return (
    <main>
      <h1>Panel de administración</h1>
      <p>Bienvenido, {session?.user.name}</p>

      <button onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  )
}

export default AdminPage