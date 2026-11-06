import { useState } from 'react'
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
import type { AuthMode } from '../types/auth'

type LandingPageProps = {
  onOpenAuth: (mode: AuthMode) => void
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

function LandingPage({ onOpenAuth }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app">
      <header className="site-header">
        <a
          className="brand"
          href="#inicio"
          aria-label="MatCom Bench Press, inicio"
        >
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
            onClick={() => onOpenAuth('login')}
          >
            Iniciar sesión
          </button>

          <button
            className="button button-primary nav-register"
            type="button"
            onClick={() => onOpenAuth('register')}
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
                onClick={() => onOpenAuth('register')}
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

          <div
            className="hero-visual"
            aria-label="Vista ilustrativa del panel"
          >
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="dashboard-card">
              <div className="dashboard-top">
                <div>
                  <span className="dashboard-kicker">
                    TU ESPACIO FITNESS
                  </span>
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
                <span>
                  <Users size={15} /> Para clientes y entrenadores
                </span>
                <span className="footer-status">MATCOM BENCH PRESS</span>
              </div>
            </div>
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
            onClick={() => onOpenAuth('register')}
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
    </div>
  )
}

export default LandingPage