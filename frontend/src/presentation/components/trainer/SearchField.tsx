
import { Search } from 'lucide-react'

type SearchFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
}

/** Campo de búsqueda con icono lateral y estilo compartido. */
function SearchField({ value, onChange, placeholder, ariaLabel }: SearchFieldProps) {
  return (
    <label className="relative block w-full min-w-0 flex-1">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a29f]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded-xl border border-[#dce8e7] bg-[#fbfdfc] py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-[#a3b2af] focus:border-[#00a699] focus:ring-2 focus:ring-[#00a699]/10"
      />
    </label>
  )
}

export default SearchField
