import { useState, useMemo } from 'react'

const CATEGORIES = {
  Length: {
    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    toBase: {
      Meters: 1,
      Kilometers: 1000,
      Centimeters: 0.01,
      Millimeters: 0.001,
      Miles: 1609.344,
      Yards: 0.9144,
      Feet: 0.3048,
      Inches: 0.0254,
    },
  },
  Weight: {
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tonnes', 'Stones'],
    toBase: {
      Kilograms: 1,
      Grams: 0.001,
      Milligrams: 0.000001,
      Pounds: 0.453592,
      Ounces: 0.0283495,
      Tonnes: 1000,
      Stones: 6.35029,
    },
  },
  Temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    custom: true,
  },
  Volume: {
    units: ['Liters', 'Milliliters', 'Gallons (US)', 'Quarts', 'Pints', 'Cups', 'Fluid Oz', 'Tablespoons', 'Teaspoons'],
    toBase: {
      Liters: 1,
      Milliliters: 0.001,
      'Gallons (US)': 3.78541,
      Quarts: 0.946353,
      Pints: 0.473176,
      Cups: 0.236588,
      'Fluid Oz': 0.0295735,
      Tablespoons: 0.0147868,
      Teaspoons: 0.00492892,
    },
  },
}

function convertTemperature(value, from, to) {
  if (from === to) return value
  let celsius
  if (from === 'Celsius') celsius = value
  else if (from === 'Fahrenheit') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15

  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

function convert(category, value, from, to) {
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  if (from === to) return formatResult(num)

  const cat = CATEGORIES[category]
  if (cat.custom) {
    return formatResult(convertTemperature(num, from, to))
  }
  const baseValue = num * cat.toBase[from]
  const result = baseValue / cat.toBase[to]
  return formatResult(result)
}

function formatResult(num) {
  if (Math.abs(num) >= 1e9 || (Math.abs(num) < 0.0001 && num !== 0)) {
    return num.toExponential(6)
  }
  const str = num.toPrecision(10)
  return parseFloat(str).toString()
}

export default function App() {
  const [category, setCategory] = useState('Length')
  const [fromUnit, setFromUnit] = useState('Meters')
  const [toUnit, setToUnit] = useState('Feet')
  const [inputValue, setInputValue] = useState('')

  const units = CATEGORIES[category].units

  const handleCategoryChange = (newCat) => {
    setCategory(newCat)
    const u = CATEGORIES[newCat].units
    setFromUnit(u[0])
    setToUnit(u[1])
    setInputValue('')
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const result = useMemo(() => {
    if (!inputValue) return ''
    return convert(category, inputValue, fromUnit, toUnit)
  }, [category, inputValue, fromUnit, toUnit])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Unit Converter</h1>
        <p style={styles.subtitle}>Quick and precise conversions</p>
      </div>

      {/* Category Tabs */}
      <div style={styles.categoryRow}>
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              ...styles.categoryBtn,
              ...(category === cat ? styles.categoryBtnActive : {}),
            }}
          >
            {cat === 'Length' && '\u2194\ufe0f'}
            {cat === 'Weight' && '\u2696\ufe0f'}
            {cat === 'Temperature' && '\ud83c\udf21\ufe0f'}
            {cat === 'Volume' && '\ud83e\udded'}
            <span style={styles.categoryLabel}>{cat}</span>
          </button>
        ))}
      </div>

      {/* Converter Card */}
      <div style={styles.card}>
        {/* From Section */}
        <div style={styles.unitSection}>
          <label style={styles.label}>From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            style={styles.select}
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            style={styles.input}
            inputMode="decimal"
          />
        </div>

        {/* Swap Button */}
        <div style={styles.swapRow}>
          <button onClick={swapUnits} style={styles.swapBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 12l-3-3m3 3l3-3" />
              <path d="M17 8v12m0-12l3 3m-3-3l-3 3" />
            </svg>
          </button>
        </div>

        {/* To Section */}
        <div style={styles.unitSection}>
          <label style={styles.label}>To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            style={styles.select}
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <div style={styles.resultBox}>
            <span style={styles.resultText}>
              {result || '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Line */}
      {inputValue && result && (
        <div style={styles.summary}>
          {inputValue} {fromUnit} = {result} {toUnit}
        </div>
      )}

      {/* Branding */}
      <div style={styles.branding}>
        <span style={styles.brandText}>ENERGENAI</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#08080e',
    color: '#e0e0ff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px 16px',
    paddingTop: 'max(20px, env(safe-area-inset-top))',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    marginTop: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 4px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  categoryRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    width: '100%',
    maxWidth: '400px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  categoryBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #1e1e2e',
    background: '#111119',
    color: '#6b7280',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: '1',
    minWidth: '75px',
  },
  categoryBtnActive: {
    background: '#1a1a2e',
    borderColor: '#a78bfa',
    color: '#a78bfa',
    boxShadow: '0 0 20px rgba(167, 139, 250, 0.15)',
  },
  categoryLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#111119',
    borderRadius: '16px',
    border: '1px solid #1e1e2e',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  unitSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #2a2a3e',
    background: '#0d0d15',
    color: '#e0e0ff',
    fontSize: '16px',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%236b7280\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
  },
  input: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #2a2a3e',
    background: '#0d0d15',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    outline: 'none',
    boxSizing: 'border-box',
  },
  swapRow: {
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0',
  },
  swapBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid #2a2a3e',
    background: '#0d0d15',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resultBox: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #2a2a3e',
    background: '#0d0d15',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  resultText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#a78bfa',
  },
  summary: {
    marginTop: '16px',
    padding: '12px 20px',
    borderRadius: '10px',
    background: 'rgba(167, 139, 250, 0.08)',
    border: '1px solid rgba(167, 139, 250, 0.2)',
    color: '#c4b5fd',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    boxSizing: 'border-box',
  },
  branding: {
    marginTop: 'auto',
    paddingTop: '32px',
    paddingBottom: '16px',
  },
  brandText: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '3px',
    color: '#2a2a3e',
  },
}
