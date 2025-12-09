
import brandLogo from "@/assets/LOGO.svg"
import { ThemeToggle } from "@/features/landing/components/themeToggle"
import { Button } from "@/shared/components/ui/button"
import { Link } from "react-router-dom"

const Header = () => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="flex items-center justify-between pb-6 pt-[20px] transition-colors duration-300"
      style={{ borderBottom: '1px solid var(--color-border)' }}>
      <Link to="/" onClick={handleLogoClick}>
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
    </Link>

    <div className="flex items-center gap-4 text-sm font-medium">
      <Button
        asChild
        variant="ghost"
        style={{ color: 'var(--color-btn-signin-text)' }}
      >
        <Link to="/signup">Sign up</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-full px-6 py-2 transition-colors duration-300"
        style={{ 
          borderColor: 'var(--color-btn-signup-border)', 
          color: 'var(--color-btn-signup-text)',
          backgroundColor: 'var(--color-btn-signup-bg)'
        }}
      >
        <Link to="/login">Sign In</Link>
      </Button>
      <ThemeToggle />
    </div>
  </header>
  )
}

export default Header
