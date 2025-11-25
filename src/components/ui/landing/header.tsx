import { Button } from "@/components/ui/landing/button"
import { ThemeToggle } from "@/components/ui/landing/themeToggle"
import brandLogo from "@/assets/LOGO.svg"

const Header = () => (
  <header className="flex items-center justify-between pb-6 transition-colors duration-300"
    style={{ borderBottom: '1px solid var(--color-border)' }}>
    <div className="flex items-center gap-3">
      <img
        src={brandLogo}
        alt="VioTune logo"
        className="h-12 w-12 rounded-full object-cover transition-colors duration-300"
        style={{ border: '1px solid var(--color-border)' }}
      />
      <p className="text-xs uppercase tracking-[0.4em] transition-colors duration-300"
        style={{ color: 'var(--color-text-muted)' }}>VioTune</p>
    </div>

    <div className="flex items-center gap-4 text-sm font-medium">
      <Button variant="ghost" style={{ color: 'var(--color-btn-signin-text)' }}>
        Sign up
      </Button>
      <Button
        variant="outline"
        className="rounded-full px-6 py-2 transition-colors duration-300"
        style={{ 
          borderColor: 'var(--color-btn-signup-border)', 
          color: 'var(--color-btn-signup-text)',
          backgroundColor: 'var(--color-btn-signup-bg)'
        }}
      >
        Sign In
      </Button>
      <ThemeToggle />
    </div>
  </header>
)

export default Header
