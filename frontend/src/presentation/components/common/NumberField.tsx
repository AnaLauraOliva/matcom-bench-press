
type NumberFieldProps = {
  value: string
  onChange: (value: string) => void
  /** Atributo `name` del input nativo; diferente al contexto de edad. */
  name?: string
}

/**
 * Campo numérico con botones de incremento y decremento.
 */
function NumberField({ value, onChange, name = 'number' }: NumberFieldProps) {
  const parsed = Number(value)

  // Incrementa el valor sin superar el máximo permitido.
  function increaseValue() {
    onChange(String(Math.min(120, (parsed || 0) + 1)))
  }

  // Disminuye el valor sin bajar de 1.
  function decreaseValue() {
    onChange(String(Math.max(1, (parsed || 2) - 1)))
  }

  return (
    <div className="number-control">
      <input
        className="number-input"
        type="number"
        name={name}
        min={1}
        max={120}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />

      <div className="number-buttons">
        <button
          type="button"
          aria-label="Incrementar valor"
          title="Incrementar valor"
          disabled={parsed >= 120}
          onClick={increaseValue}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
          >
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
          aria-label="Decrementar valor"
          title="Decrementar valor"
          disabled={value !== '' && parsed <= 1}
          onClick={decreaseValue}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            aria-hidden="true"
          >
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
  )
}

export default NumberField
