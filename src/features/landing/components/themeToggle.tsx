import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ 
        backgroundColor: isDark ? '#333333' : '#e5e5e5',
      }}
      aria-label="Toggle theme"
    >
      {/* Slider knob with icon */}
      <span
        className="absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 shadow-md"
        style={{
          left: isDark ? 'calc(100% - 1.625rem)' : '0.125rem',
          backgroundColor: isDark ? '#F0D800' : '#ffffff',
        }}
      >
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-black" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-gray-600" />
        )}
      </span>
    </button>
  )
}