import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner"
import axios from "axios"

// Thêm prop email để gửi kèm API
interface ResetPasswordProps {
  email?: string; 
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function ResetPassword({ email, onBack, onSuccess }: ResetPasswordProps) {
  // State quản lý 2 ô nhập
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // API Config
  const API_URL = "https://uit-music-production.up.railway.app"
  const API_ENDPOINT = "/api/auth/reset-password"

  const handleSubmit = async () => {
    setError("")

    // 1. Validate: Rỗng
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    // 2. Validate: Độ dài (Ví dụ tối thiểu 6 ký tự)
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // 3. Validate: Confirm Password phải khớp
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      toast.warning("Mismatch", { description: "Confirm password does not match new password." })
      return
    }

    setIsLoading(true)

    try {
      // ============================================================
      // [PHẦN GIẢ LẬP - TEST LOGIC MK CŨ]
      // Frontend không biết MK cũ, nhưng ta giả vờ server trả về lỗi này
      // Test: Thử nhập mật khẩu là "oldpassword" để thấy lỗi
      // ============================================================
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (newPassword === "oldpassword") {
        throw new Error("New password cannot be the same as the old password")
      }

      // ============================================================
      // [PHẦN THỰC TẾ - GỌI API]
      // ============================================================
      /* await axios.post(`${API_URL}${API_ENDPOINT}`, {
        email: email,
        newPassword: newPassword,
        confirmPassword: confirmPassword // Tùy backend có cần hay không
      })
      */

      // THÀNH CÔNG
      toast.success("Password Reset Successful", {
        description: "Your password has been updated. Redirecting to Login...",
        duration: 3000,
      })

      // Chuyển trang sau 1.5s
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }

    } catch (err: any) {
      console.error("Error:", err)
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      
      setError(errorMessage)
      toast.error("Reset Failed", { description: errorMessage })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* NÚT BACK */}
      <button 
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-all text-[#D8DFF5] bg-transparent"
        onClick={onBack}
        disabled={isLoading}
        aria-label="Back to Enter Code"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* KHỐI TRUNG TÂM */}
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="w-full py-4 text-center">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-[#BDCAEE] drop-shadow-md">
            Reset Password
          </h1>
        </div>

        <div className="space-y-6">
          
          {/* Ô NHẬP MK MỚI */}
          <div className="space-y-2">
            <Label 
              htmlFor="new-password" 
              className="inline-block font-bold text-sm tracking-wide ml-1 bg-transparent text-[#D8DFF5]"
            >
              NEW PASSWORD
            </Label>
            <Input 
              id="new-password" 
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (error) setError("")
              }}
              placeholder="Enter new password" 
              type="password"
              disabled={isLoading}
              className={`h-14 rounded-xl text-lg shadow-sm focus-visible:ring-0 placeholder:text-gray-400 text-white transition-all bg-transparent
                ${error 
                  ? "border-red-500 bg-red-500/10 placeholder:text-red-300 border-2" 
                  : "border-[#D8DFF5] border-2"
                }
              `}
            />
          </div>

          {/* Ô NHẬP LẠI MK */}
          <div className="space-y-2">
            <Label 
              htmlFor="confirm-password" 
              className="inline-block font-bold text-sm tracking-wide ml-1 bg-transparent text-[#D8DFF5]"
            >
              CONFIRM PASSWORD
            </Label>
            <Input 
              id="confirm-password" 
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (error) setError("")
              }}
              placeholder="Re-enter password" 
              type="password"
              disabled={isLoading}
              className={`h-14 rounded-xl text-lg shadow-sm focus-visible:ring-0 placeholder:text-gray-400 text-white transition-all bg-transparent
                ${error 
                  ? "border-red-500 bg-red-500/10 placeholder:text-red-300 border-2" 
                  : "border-[#D8DFF5] border-2"
                }
              `}
            />
             {error && (
              <p className="text-red-400 text-sm font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                 {error}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg uppercase tracking-wide bg-[#D8DFF5] text-[#3A5FCD]"
          >
             {isLoading ? "UPDATING..." : "CONTINUE"}
          </Button>
        </div>
      </div>
    </div>
  )
}