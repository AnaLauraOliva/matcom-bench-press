
import { useState, type FormEvent, useRef, useEffect } from 'react'
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

type AuthMode = 'login' | 'register'

type AuthForm = {
  name: string
  email: string
  phone: string
  password: string
  age: string
  sex: '' | 'FEMENINO' | 'MASCULINO' | 'OTRO'
  locationName: string
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


type SelectOption = {
  value: string
  label: string
}

type CustomSelectProps = {
  value: string
  options: SelectOption[]
  placeholder: string
  onChange: (value: string) => void
}

function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
    }
  }, [])

  function chooseOption(option: SelectOption) {
    onChange(option.value)
    setIsOpen(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()

      if (!isOpen) {
        setIsOpen(true)
        const selectedIndex = options.findIndex(
          (option) => option.value === value,
        )
        setActiveIndex(
          selectedIndex >= 0 ? selectedIndex : 0,
        )
        return
      }

      setActiveIndex((current) => {
        if (event.key === 'ArrowDown') {
          return (current + 1) % options.length
        }

        return (current - 1 + options.length) % options.length
      })
    }

    if (event.key === 'Enter' && isOpen) {
      event.preventDefault()
      chooseOption(options[activeIndex])
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
    }

    if (event.key === 'Home' && isOpen) {
      event.preventDefault()
      setActiveIndex(0)
    }

    if (event.key === 'End' && isOpen) {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    }
  }

  return (
    <div className="custom-select" ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!isOpen) {
            const selectedIndex = options.findIndex(
              (option) => option.value === value,
            )
            setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
          }
          setIsOpen((open) => !open)
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={!selectedOption ? 'custom-select-placeholder' : ''}>
          {selectedOption?.label ?? placeholder}
        </span>

        <svg
          className="custom-select-chevron"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`custom-option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              className={[
                'custom-select-option',
                option.value === value ? 'is-selected' : '',
                index === activeIndex ? 'is-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                chooseOption(option)
              }}
            >
              <span>{option.label}</span>

              {option.value === value && (
                <span className="custom-select-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


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
    locationName: '',
  })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setForm({
  name: '',
  email: '',
  phone: '',
  password: '',
  age: '',
  sex: '',
  locationName: '',
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
        locationName: form.locationName.trim(),
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
                <>
                  <label>
                    Nombre completo
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      maxLength={100}
                      required
                    />
                  </label>

                  <label>
                    Teléfono
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          phone: event.target.value.replace(/\D/g, ''),
                        })
                      }
                      maxLength={30}
                      pattern="[0-9]+"
                      title="Introduce el teléfono usando solo números."
                      required
                    />
                  </label>
                  
                  <label>
                    Edad
                    <div className="age-control">
                      <input
                        className="age-input"
                        type="number"
                        name="age"
                        min={1}
                        max={120}
                        step={1}
                        value={form.age}
                        onChange={(event) =>
                          setForm({ ...form, age: event.target.value })
                        }
                        required
                      />

                      <div className="age-buttons">
                        <button
                          type="button"
                          aria-label="Aumentar edad"
                          title="Aumentar edad"
                          disabled={Number(form.age) >= 120}
                          onClick={() =>
                            setForm({
                              ...form,
                              age: String(Math.min(120, (Number(form.age) || 0) + 1)),
                            })
                          }
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                            <path
                              d="m6 14 6-6 6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          aria-label="Disminuir edad"
                          title="Disminuir edad"
                          disabled={form.age !== '' && Number(form.age) <= 1}
                          onClick={() =>
                            setForm({
                              ...form,
                              age: String(Math.max(1, (Number(form.age) || 2) - 1)),
                            })
                          }
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                            <path
                              d="m6 10 6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </label>
                  
                  <label>
                    Género
                    <CustomSelect
                      value={form.sex}
                      placeholder="Selecciona una opción"
                      options={[
                        { value: 'FEMENINO', label: 'Femenino' },
                        { value: 'MASCULINO', label: 'Masculino' },
                        { value: 'OTRO', label: 'Otro' },
                      ]}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          sex: value as AuthForm['sex'],
                        })
                      }
                    />
                  </label>

                  <label>
                    Sede del gimnasio
                    <input
                      type="text"
                      name="locationName"
                      value={form.locationName}
                      onChange={(event) =>
                        setForm({ ...form, locationName: event.target.value })
                      }
                      required
                    />
                  </label>
                </>
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
                    authMode === 'register' ? 'new-password' : 'current-password'
                  }
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  minLength={8}
                  maxLength={72}
                  pattern={
                    authMode === 'register'
                      ? '(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,72}'
                      : undefined
                    }
                  title={
                    authMode === 'register'
                      ? 'Debe tener entre 8 y 72 caracteres, incluyendo una letra, un número y un símbolo.'
                      : undefined
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
