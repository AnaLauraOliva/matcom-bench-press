
import { useState, type FormEvent } from 'react'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import './App.css'

type AuthMode = 'login' | 'register'

type AuthForm = {
  name: string
  email: string
  password: string
}

const features = [
  {
    icon: ClipboardList,
    title: 'Rutinas organizadas',
    description:
      'Consulta y organiza planes de entrenamiento desde un mismo lugar.',
  },
  {
    icon: Dumbbell,
    title: 'Entrenamiento personalizado',
    description:
      'Trabaja con ejercicios clasificados por tipo, intensidad y grupo muscular.',
  },
  {
    icon: Activity,
    title: 'Seguimiento del progreso',
    description:
      'Facilita el seguimiento de las sesiones y la evolución del entrenamiento.',
  },
]

function App() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState<AuthForm>({
    name: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setForm({ name: '', email: '', password: '' })
    setMessage('')
    setMenuOpen(false)
  }

  function closeAuth() {
    setAuthMode(null)
    setMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      // TODO: importar la función de registro o inicio de sesión desde
      // src/api/auth.ts cuando el equipo backend confirme sus rutas.
      // No se guardan usuarios en la base de datos desde el navegador.
      // La llamada real se añadirá en el paso de integración con el backend.

      setMessage(
        'La interfaz está preparada. Falta conectar el backend para validar el acceso y guardar el registro.',
      )
    } catch {
      setMessage(
        'No se pudo completar la operación. Comprueba la conexión e inténtalo de nuevo.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="FitPlan, inicio">
          <span className="brand-icon">
            <Dumbbell size={23} strokeWidth={2.5} />
          </span>
          <span>Matcom Bench Press</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav className={`navigation ${menuOpen ? 'navigation-open' : ''}`}>
          <a href="#funcionalidades" onClick={() => setMenuOpen(false)}>
            Funcionalidades
          </a>
          <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
            Cómo funciona
          </a>
          <button
            className="button button-outline"
            type="button"
            onClick={() => openAuth('login')}
          >
            Iniciar sesión
          </button>
          <button
            className="button button-primary nav-register"
            type="button"
            onClick={() => openAuth('register')}
          >
            Crear cuenta
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              TU ENTRENAMIENTO, MEJOR ORGANIZADO
            </span>

            <h1>
              Entrena con un plan.
              <span> Avanza con propósito.</span>
            </h1>

            <p className="hero-description">
              Organiza tus rutinas, trabaja con ejercicios estructurados y
              lleva un mejor seguimiento de tu entrenamiento desde un solo
              lugar.
            </p>

            <div className="hero-actions">
              <button
                className="button button-primary button-large"
                type="button"
                onClick={() => openAuth('register')}
              >
                Comenzar ahora <ArrowRight size={18} />
              </button>
              <a className="text-link" href="#funcionalidades">
                Descubrir funcionalidades
              </a>
            </div>

            <div className="hero-trust">
              <span className="trust-icon">
                <ShieldCheck size={19} />
              </span>
              <span>Una experiencia diseñada para tu entrenamiento</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Vista ilustrativa del panel">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="dashboard-card">
              <div className="dashboard-top">
                <div>
                  <span className="dashboard-kicker">TU ESPACIO FITNESS</span>
                  <h2>Panel de entrenamiento</h2>
                </div>
                <span className="dashboard-mark">
                  <Activity size={21} />
                </span>
              </div>

              <div className="welcome-panel">
                <div>
                  <span className="welcome-label">EMPIEZA HOY</span>
                  <h3>Tu próximo objetivo te espera.</h3>
                  <p>Un paso a la vez. Una sesión a la vez.</p>
                </div>
                <div className="welcome-figure">
                  <Dumbbell size={43} strokeWidth={1.6} />
                </div>
              </div>

              <div className="dashboard-section-heading">
                <span>Tu entrenamiento</span>
                <span className="live-dot" />
              </div>

              <div className="mini-feature">
                <span className="mini-icon">
                  <ClipboardList size={20} />
                </span>
                <div className="mini-copy">
                  <strong>Rutinas estructuradas</strong>
                  <span>Ejercicios y objetivos organizados</span>
                </div>
                <CheckCircle2 className="mini-check" size={20} />
              </div>

              <div className="mini-feature">
                <span className="mini-icon mini-icon-light">
                  <Activity size={20} />
                </span>
                <div className="mini-copy">
                  <strong>Seguimiento de sesiones</strong>
                  <span>Registra tu actividad y evolución</span>
                </div>
                <ArrowRight className="mini-arrow" size={19} />
              </div>

              <div className="dashboard-footer">
                <span><Users size={15} /> Para clientes y entrenadores</span>
                <span className="footer-status">MATCOM BENCH PRESS</span>
              </div>
            </div>

            {/* <div className="floating-note">
              <span className="floating-note-icon">
                <CheckCircle2 size={20} />
              </span>
              <span>
                <strong>Todo en un lugar</strong>
                <small>Tu entrenamiento, organizado</small>
              </span>
            </div> */}
          </div>
        </section>

        <section className="features-section" id="funcionalidades">
          <div className="section-heading">
            <span className="section-label">FUNCIONALIDADES</span>
            <h2>Todo lo que necesitas para organizarte mejor</h2>
            <p>
              Una base sencilla para gestionar el entrenamiento de forma
              estructurada y facilitar el seguimiento del progreso.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article className="feature-card" key={feature.title}>
                  <span className="feature-icon">
                    <Icon size={24} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href="#como-funciona" className="feature-link">
                    Conocer más <ArrowRight size={16} />
                  </a>
                </article>
              )
            })}
          </div>
        </section>

        <section className="cta-section" id="como-funciona">
          <div>
            <span className="section-label">EMPIEZA POR LO ESENCIAL</span>
            <h2>Organiza tu entrenamiento desde hoy.</h2>
            <p>
              Crea tu cuenta y prepárate para gestionar tus rutinas en un
              espacio pensado para el gimnasio.
            </p>
          </div>
          <button
            className="button button-light button-large"
            type="button"
            onClick={() => openAuth('register')}
          >
            Crear mi cuenta <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-icon">
            <Dumbbell size={20} />
          </span>
          <span>MatCom Bench Press</span>
        </a>
        <p>Organiza tus rutinas. Construye tu progreso.</p>
        <span className="copyright">Proyecto universitario · 2026</span>
      </footer>

      {authMode && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAuth()
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Cerrar formulario"
              onClick={closeAuth}
            >
              <X size={22} />
            </button>

            <span className="auth-logo">
              <Dumbbell size={25} />
            </span>

            <span className="section-label">
              {authMode === 'register' ? 'ÚNETE A MATCOM BENCH PRESS' : 'QUÉ BUENO VERTE'}
            </span>
            <h2 id="auth-title">
              {authMode === 'register'
                ? 'Crea tu cuenta'
                : 'Inicia sesión'}
            </h2>
            <p className="auth-subtitle">
              {authMode === 'register'
                ? 'Prepara el camino para tu próximo objetivo.'
                : 'Accede a tu espacio de entrenamiento.'}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {authMode === 'register' && (
                <label>
                  Nombre completo
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    required
                  />
                </label>
              )}

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  name="password"
                  autoComplete={
                    authMode === 'register'
                      ? 'new-password'
                      : 'current-password'
                  }
                  placeholder="Al menos 8 caracteres"
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  required
                />
              </label>

              {message && (
                <p className="form-message" role="status">
                  {message}
                </p>
              )}

              <button
                className="button button-primary auth-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Procesando...'
                  : authMode === 'register'
                    ? 'Crear cuenta'
                    : 'Iniciar sesión'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="auth-switch">
              {authMode === 'register'
                ? '¿Ya tienes una cuenta?'
                : '¿Todavía no tienes una cuenta?'}{' '}
              <button
                type="button"
                onClick={() =>
                  openAuth(authMode === 'register' ? 'login' : 'register')
                }
              >
                {authMode === 'register'
                  ? 'Inicia sesión'
                  : 'Regístrate'}
              </button>
            </p>

            <p className="auth-note">
              La autenticación se habilitará al integrar el backend.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
