
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

// Define la estructura de cada opción del selector.
export type SelectOption = {
  value: string
  label: string
}

// Propiedades que recibe el componente.
type CustomSelectProps = {
  value: string
  options: SelectOption[]
  placeholder: string
  onChange: (value: string) => void
  disabled?: boolean
}

function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  // Busca la opción que coincide con el valor seleccionado.
  const selectedOption = options.find(
    (option) => option.value === value,
  )

  // Cierra el menú cuando se hace clic fuera del selector.
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

  // Selecciona una opción y cierra el menú.
  function chooseOption(option: SelectOption) {
    onChange(option.value)
    setIsOpen(false)
  }

  // Gestiona la navegación mediante el teclado.
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || options.length === 0) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()

      if (!isOpen) {
        setIsOpen(true)

        const selectedIndex = options.findIndex(
          (option) => option.value === value,
        )

        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
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
        disabled={disabled}
        onClick={() => {
          if (disabled || options.length === 0) return

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

export default CustomSelect
