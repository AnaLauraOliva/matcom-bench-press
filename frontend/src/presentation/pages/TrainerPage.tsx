import { useAuthSession } from '../contexts/useAuthSession'

function TrainerPage() {
  const { session, logout } = useAuthSession()

  const isHeadTrainer = session?.user.role === 'HEAD_TRAINER'

  return (
    <main>
      <h1>Panel de entrenamiento</h1>
      <p>Bienvenido, {session?.user.name}</p>

      {isHeadTrainer && (
        <section>
          <h2>Funciones adicionales del jefe de sala</h2>
          <p>
            Aquí aparecerán las funcionalidades exclusivas
            del jefe de sala.
          </p>
        </section>
      )}

      <button onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  )
}

export default TrainerPage