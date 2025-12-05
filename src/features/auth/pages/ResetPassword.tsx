import { useState } from "react"
import { useNavigate, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner"
import { authService } from "@/core/services/auth.service"

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, code } = location.state || {}

  // Redirect nếu không có email hoặc code
  if (!email || !code) {
    navigate("/forgot-password/enter-code", { replace: true, state: { email } })
    return null
  }
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự"
    }
    if (password.length > 50) {
      return "Mật khẩu không được vượt quá 50 ký tự"
    }
    // Có thể thêm các validation khác như yêu cầu chữ hoa, số, ký tự đặc biệt
    return null
  }

  const handleSubmit = async () => {
    setError("")
    
    // Validation cơ bản
    if (!newPassword || !confirmPassword) {
      return setError("Vui lòng điền đầy đủ các trường")
    }
    
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      return setError(passwordError)
    }
    
    if (newPassword !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp")
    }

    setIsLoading(true)

    try {
      await authService.resetPassword(code, newPassword, confirmPassword)
      toast.success("Success", { description: "Đặt lại mật khẩu thành công", duration: 3000 })
      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (err: any) {
      console.error("Reset Password Error:", err)
      const serverMsg = err?.message || err?.response?.data?.message || err?.response?.data?.description || "Đặt lại mật khẩu thất bại."
      
      // Xử lý các loại lỗi cụ thể
      const errorMsg = serverMsg.toLowerCase()
      if (errorMsg.includes("otp") || errorMsg.includes("code") || errorMsg.includes("token")) {
        setError("Mã xác nhận không hợp lệ. Vui lòng quay lại và thử lại.")
        toast.error("Failed", { description: "Mã xác nhận không hợp lệ." })
      } else if (errorMsg.includes("same") || errorMsg.includes("giống") || errorMsg.includes("cũ")) {
        setError("Mật khẩu mới phải khác mật khẩu cũ")
        toast.error("Failed", { description: "Mật khẩu mới phải khác mật khẩu cũ" })
      } else if (errorMsg.includes("invalid") || errorMsg.includes("không hợp lệ")) {
        setError("Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.")
        toast.error("Failed", { description: serverMsg })
      } else {
        setError(serverMsg)
        toast.error("Failed", { description: serverMsg })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* SỬA LỖI: Thêm aria-label */}
      <button 
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-all text-[#D8DFF5] bg-transparent" 
        onClick={() => navigate("/forgot-password/enter-code", { state: { email } })} 
        disabled={isLoading}
        aria-label="Back to Enter Code Screen"
        title="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="w-full max-w-md space-y-6 px-4">
        <div className="w-full py-4 text-center">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-[#BDCAEE] drop-shadow-md">Reset Password</h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="new" className="inline-block font-bold text-sm tracking-wide ml-1 bg-transparent text-[#D8DFF5]">NEW PASSWORD</Label>
            <Input 
              id="new" 
              value={newPassword} 
              onChange={(e) => {setNewPassword(e.target.value); if(error) setError("")}} 
              placeholder="New password" 
              type="password" 
              disabled={isLoading} 
              // SỬA LỖI: Dùng class Tailwind
              className={`h-14 rounded-xl text-lg text-white bg-transparent border-2 ${error ? "border-red-500" : "border-[#D8DFF5]"}`} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="inline-block font-bold text-sm tracking-wide ml-1 bg-transparent text-[#D8DFF5]">CONFIRM PASSWORD</Label>
            <Input 
              id="confirm" 
              value={confirmPassword} 
              onChange={(e) => {setConfirmPassword(e.target.value); if(error) setError("")}} 
              placeholder="Confirm password" 
              type="password" 
              disabled={isLoading} 
              // SỬA LỖI: Dùng class Tailwind
              className={`h-14 rounded-xl text-lg text-white bg-transparent border-2 ${error ? "border-red-500" : "border-[#D8DFF5]"}`} 
            />
            {error && <p className="text-red-400 text-sm font-bold ml-1">{error}</p>}
          </div>

          <Button onClick={handleSubmit} disabled={isLoading} className="w-full h-14 text-lg font-bold rounded-xl hover:opacity-90 shadow-lg uppercase tracking-wide bg-[#D8DFF5] text-[#3A5FCD]">
             {isLoading ? "UPDATING..." : "CONTINUE"}
          </Button>
        </div>
      </div>
    </div>
  )
}