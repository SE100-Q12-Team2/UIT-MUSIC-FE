import { ArrowRight } from "lucide-react"

const socialLinks = [
  { name: "Facebook", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
]

const Footer = () => {
  return (
    <footer 
      className="py-12 lg:py-16 border-t transition-colors duration-300"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left Side */}
        <div className="space-y-6">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight transition-colors duration-300"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Come enjoy with
            <br />
            music with us
          </h2>

          {/* Social Links & Copyright */}
          <div 
            className="flex flex-wrap items-center gap-4 text-sm transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {socialLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-4">
                <a
                  href={link.href}
                  className="hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {link.name}
                </a>
                {index < socialLinks.length - 1 && (
                  <span style={{ color: 'var(--color-border)' }}>|</span>
                )}
              </span>
            ))}
            <span className="ml-4" style={{ color: 'var(--color-text-muted)' }}>©2022 UpSouly</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6 lg:text-right">
          {/* Newsletter */}
          <div className="space-y-3">
            <p 
              className="text-sm transition-colors duration-300"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Keep up with our new releases, music and what
              <br />
              Emma's been up to.
            </p>
            <div 
              className="flex items-center gap-2 border-b pb-2 max-w-xs lg:ml-auto transition-colors duration-300"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent text-sm outline-none transition-colors duration-300"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <button 
                className="transition-colors duration-300 hover:opacity-80"
                style={{ color: 'var(--color-btn-arrow)' }}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Legal Links */}
          <div 
            className="flex items-center gap-6 text-sm lg:justify-end transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <a href="#" className="hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
