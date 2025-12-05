import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner" 
import { authService } from "@/core/services/auth.service"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")
    if (!email) return setError("Please enter your email")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return setError("Invalid email format")

    setIsLoading(true)

    try {
      await authService.forgotPassword(email)
      toast.success("Success", { description: "OTP sent to email.", duration: 3000 })
      setTimeout(() => {
        navigate("/forgot-password/enter-code", { state: { email } })
      }, 1000)
    } catch (err: any) {
      console.error("API Error:", err)
      // Xử lý các loại lỗi từ API
      const serverMsg = err?.message || err?.response?.data?.message || err?.response?.data?.description || "Email không tồn tại trong hệ thống."
      setError(serverMsg)
      toast.error("Failed", { description: serverMsg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* SỬA LỖI: Thêm aria-label cho người khiếm thị + title cho người dùng thường */}
      <button 
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-all text-[#D8DFF5] bg-transparent"
        onClick={() => navigate("/login")}
        disabled={isLoading}
        aria-label="Back to Login Screen" 
        title="Back to Login"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="w-full max-w-md space-y-6 px-4">
        <div className="w-full py-6 text-center">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-[#BDCAEE] drop-shadow-md">Forgot Password</h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="inline-block font-bold text-sm tracking-wide ml-1 bg-transparent text-[#D8DFF5]">EMAIL</Label>
            <Input 
              id="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); if(error) setError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
              placeholder="name@example.com" 
              type="email"
              disabled={isLoading}
              // SỬA LỖI: Dùng class Tailwind thay vì inline style
              className={`h-14 rounded-xl text-lg text-white bg-transparent border-2 transition-all focus-visible:ring-0 ${error ? "border-red-500 bg-red-500/10" : "border-[#D8DFF5]"}`}
            />
            {error && <p className="text-red-400 text-sm font-bold ml-1">{error}</p>}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold rounded-xl hover:opacity-90 shadow-lg uppercase tracking-wide bg-[#D8DFF5] text-[#3A5FCD]"
          >
            {isLoading ? "SENDING..." : "SUBMIT"}
          </Button>
        </div>
      </div>
    </div>
  )
}