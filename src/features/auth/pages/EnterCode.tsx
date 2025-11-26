import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner"
import axios from "axios"

interface EnterCodeProps {
  email?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function EnterCode({ email, onBack, onSuccess }: EnterCodeProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // API Config (Để dành cho sau này)
  const API_URL = "https://uit-music-production.up.railway.app"
  const API_ENDPOINT = "/api/auth/verify-code" // Ví dụ endpoint xác thực

  const handleSubmit = async () => {
    setError("")

    // 1. Validate độ dài (Bắt buộc đủ 6 số)
    if (otp.length < 6) {
      setError("Please enter full 6-digit code")
      toast.warning("Code Incomplete", { description: "Please enter all 6 digits." })
      return
    }

    setIsLoading(true)

    try {
      // ============================================================
      // [PHẦN GIẢ LẬP - TEST MODE]
      // Vì chưa nhận được mail thật, ta quy định code đúng là "123456"
      // ============================================================
      
      // Giả vờ đợi 1.5 giây cho giống đang gọi mạng
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Logic kiểm tra giả
      if (otp !== "123456") {
        throw new Error("Invalid verification code")
      }

      // ============================================================
      // [PHẦN THỰC TẾ - SAU NÀY BỎ COMMENT DÒNG DƯỚI LÀ CHẠY]
      // ============================================================
      /* await axios.post(`${API_URL}${API_ENDPOINT}`, {
        email: email,
        code: otp
      })
      */

      // THÀNH CÔNG
      toast.success("Verification Successful", {
        description: "Redirecting to Reset Password...",
        duration: 2000,
      })

      // Chuyển trang sau 1s
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1000)
      }

    } catch (err: any) {
      console.error("Error:", err)
      
      // Lấy lỗi từ server hoặc lỗi giả lập
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      
      setError(errorMessage)
      
      // Toast báo lỗi
      toast.error("Verification Failed", {
        description: errorMessage
      })

      // Reset mã để nhập lại cho tiện (tuỳ chọn)
      // setOtp("") 

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <button 
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-all text-[#D8DFF5] bg-transparent"
        onClick={onBack}
        disabled={isLoading}
        aria-label="Back to Forgot Password"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <div className="w-full max-w-md space-y-8 px-4 flex flex-col items-center">
        
        <div className="w-full py-2 text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-[#BDCAEE] drop-shadow-md">
            Enter Code
          </h1>
          <p className="text-gray-300 text-sm tracking-wide">
            Enter The Code Sent To: <span className="font-bold text-white">{email || "Your Email"}</span>
          </p>
        </div>

        <div className="space-y-8 w-full flex flex-col items-center">
          
          {/* INPUT OTP */}
          <div className="relative">
            <InputOTP 
              maxLength={6} 
              value={otp} 
              onChange={(value) => {
                setOtp(value)
                if (error) setError("") // Nhập lại thì xóa lỗi đỏ
              }}
              disabled={isLoading}
            >
              <InputOTPGroup className="gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot 
                    key={index}
                    index={index} 
                    // Logic Class: Nếu có lỗi -> Viền đỏ + Nền đỏ nhạt. Bình thường -> Viền #D8DFF5
                    className={`w-12 h-14 text-xl font-bold text-white rounded-lg transition-all
                      ${error 
                        ? "border-red-500 bg-red-500/20 animate-pulse" 
                        : "border-[#D8DFF5] bg-transparent"
                      }
                    `}
                    // Ghi đè style border nếu cần thiết để đảm bảo độ ưu tiên
                    style={{ 
                      borderWidth: '2px',
                      borderColor: error ? '#ef4444' : '#D8DFF5'
                    }} 
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            
            {/* Dòng báo lỗi nằm ngay dưới ô nhập */}
            {error && (
              <p className="absolute -bottom-6 left-0 w-full text-center text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg uppercase tracking-wide flex items-center justify-center gap-2 bg-[#D8DFF5] text-[#3A5FCD]"
          >
             {isLoading ? "VERIFYING..." : "SUBMIT"}
          </Button>
        </div>
      </div>
    </div>
  )
}