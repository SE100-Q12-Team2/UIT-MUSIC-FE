import { useState } from "react"
import { useNavigate, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner"
import { authService } from "@/core/services/auth.service"

export default function EnterCode() {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)
  
  const email = location.state?.email || ""

  // Redirect nếu không có email
  if (!email) {
    navigate("/forgot-password", { replace: true })
    return null
  }

  const handleSubmit = () => {
    setError("")
    if (otp.length < 6) {
      return setError("Please enter full 6-digit code")
    }
    // OTP sẽ được verify khi reset password, không cần verify riêng
    navigate("/forgot-password/reset", { state: { email, code: otp } })
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      await authService.resendOtp(email, "FORGOT_PASSWORD")
      toast.success("OTP Resent", { description: "Please check your email again." })
    } catch (err: unknown) {
      const errorObj = err as { message?: string; response?: { data?: { message?: string; description?: string } } };
      const serverMsg = errorObj?.message || errorObj?.response?.data?.message || errorObj?.response?.data?.description || "Could not resend OTP."
      toast.error("Failed", { description: serverMsg })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* SỬA LỖI: Thêm aria-label */}
      <button 
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-all text-[#D8DFF5] bg-transparent" 
        onClick={() => navigate("/forgot-password")}
        aria-label="Back to Forgot Password Screen"
        title="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="w-full max-w-md space-y-8 px-4 flex flex-col items-center">
        <div className="w-full py-2 text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-[#BDCAEE] drop-shadow-md">Enter Code</h1>
          <p className="text-gray-300 text-sm">Code Sent To: <span className="font-bold text-white">{email}</span></p>
        </div>

        <div className="space-y-8 w-full flex flex-col items-center">
          <div className="relative">
            <InputOTP maxLength={6} value={otp} onChange={(val) => {setOtp(val); if(error) setError("")}}>
              <InputOTPGroup className="gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className={`w-12 h-14 text-xl font-bold text-white rounded-lg border-2 bg-transparent ${error ? "border-red-500 animate-pulse" : "border-[#D8DFF5]"}`} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <p className="absolute -bottom-8 left-0 w-full text-center text-red-400 text-sm font-bold">{error}</p>}
          </div>

          <div className="w-full space-y-3">
            <Button onClick={handleSubmit} className="w-full h-14 text-lg font-bold rounded-xl hover:opacity-90 shadow-lg uppercase tracking-wide bg-[#D8DFF5] text-[#3A5FCD]">
              SUBMIT
            </Button>
            <button onClick={handleResendCode} disabled={isResending} className="w-full text-center text-sm text-[#BDCAEE] hover:text-white underline decoration-dashed underline-offset-4 disabled:opacity-50">
              {isResending ? "Resending..." : "Didn't receive code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}