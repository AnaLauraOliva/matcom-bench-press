import { useState, type FormEvent, useEffect } from 'react'
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

import axios from 'axios'
import { login, register } from './api/auth'
import { getLocations } from './api/locations'
import type { Location } from './types/location'

import AuthModal from './components/auth/AuthModal'
import type { AuthForm, AuthMode } from './types/auth'

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
    phone: '',
    password: '',
    age: '',
    sex: '',
    idLocation: '',
  })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const [locationsError, setLocationsError] = useState('')
  
  useEffect(() => {
    async function loadLocations() {
      try {
        setIsLoadingLocations(true)

        const data = await getLocations()
        setLocations(data)
      } catch (error) {
        console.error('Error al cargar las sedes:', error)
        setLocationsError('No se pudieron cargar las sedes. Recarga la página.')
      } finally {
        setIsLoadingLocations(false)
      }
    }

    loadLocations()
  }, [])

  function handleFormChange(field: keyof AuthForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setForm({
  name: '',
  email: '',
  phone: '',
  password: '',
  age: '',
  sex: '',
  idLocation: '',
})
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

  if (authMode === 'register' && !form.sex) {
    setMessage('Selecciona una opción de género.')
    return
  }

  if (authMode === 'register' && !form.idLocation) {
    setMessage('Selecciona una sede del gimnasio.')
    return
  }
  
  setIsSubmitting(true)

  try {
    if (authMode === 'login') {
      const result = await login({
        email: form.email.trim(),
        password: form.password,
      })

      // TODO: guardar el token en el estado de autenticación
      // e integrar los datos del usuario en la aplicación.
      console.log('Usuario autenticado:', result.user)

      setMessage('Inicio de sesión correcto.')
    } else if (authMode === 'register') {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: 'CLIENT',
        age: Number(form.age),
        sex: form.sex as 'FEMENINO' | 'MASCULINO' | 'OTRO',
        idLocation: Number(form.idLocation),
      })

      setMessage('Registro completado correctamente.')
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<{
      error?: { code?: string; message?: string }
    }>(error)) {
      setMessage(
        error.response?.data?.error?.message ??
          'No se pudo completar la operación. Comprueba los datos y la conexión con el servidor.',
      )
    } else {
      setMessage('Ocurrió un error inesperado.')
    }
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="MatCom Bench Press, inicio">
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
        <AuthModal
          mode={authMode}
          form={form}
          locations={locations}
          isLoadingLocations={isLoadingLocations}
          locationsError={locationsError}
          message={message}
          isSubmitting={isSubmitting}
          onClose={closeAuth}
          onSubmit={handleSubmit}
          onSwitchMode={() =>
            openAuth(authMode === 'register' ? 'login' : 'register')
          }
          onFormChange={handleFormChange}
        />
      )}
    </div>
  )
}

export default App