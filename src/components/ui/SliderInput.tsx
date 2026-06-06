interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
  hint?: string
}

export default function SliderInput({ label, value, min, max, step, unit, onChange, hint }: Props) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-3">
        <label className="text-sm text-slate-600">{label}</label>
        <span className="text-3xl font-bold text-indigo-600">
          {value}<span className="text-lg font-normal text-slate-400 ml-1">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
      {hint && <p className="text-xs text-slate-400 mt-2">{hint}</p>}
    </div>
  )
}
