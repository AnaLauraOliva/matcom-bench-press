
type AgeInputProps = {
  value: string
  onChange: (value: string) => void
}

function AgeInput({ value, onChange }: AgeInputProps) {
  const age = Number(value)

  // Incrementa la edad sin superar el máximo permitido.
  function increaseAge() {
    onChange(String(Math.min(120, (age || 0) + 1)))
  }

  // Disminuye la edad sin bajar de 1.
  function decreaseAge() {
    onChange(String(Math.max(1, (age || 2) - 1)))
  }

  return (
    <div className="age-control">
      <input
        className="age-input"
        type="number"
        name="age"
        min={1}
        max={120}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />

      <div className="age-buttons">
        <button
          type="button"
          aria-label="Aumentar edad"
          title="Aumentar edad"
          disabled={age >= 120}
          onClick={increaseAge}
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
          aria-label="Disminuir edad"
          title="Disminuir edad"
          disabled={value !== '' && age <= 1}
          onClick={decreaseAge}
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

export default AgeInput