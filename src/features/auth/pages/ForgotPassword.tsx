import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner" 
import axios from "axios"

interface ForgotPasswordProps {
  onSuccess?: (email: string) => void;
}

export default function ForgotPassword({ onSuccess }: ForgotPasswordProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // API Config
  const API_URL = "https://uit-music-production.up.railway.app"
  // Thử cái này trước
  const API_ENDPOINT = "/auth/forgot-password"

  const handleSubmit = async () => {
    setError("")

    // Validate Empty
    if (!email) {
      setError("Please enter your email address")
      return
    }
    
    // Validate Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Invalid email format")
      return
    }

    setIsLoading(true)

    try {
      // GỌI API THẬT
      await axios.post(`${API_URL}${API_ENDPOINT}`, {
        email: email
      })

      // THÔNG BÁO THÀNH CÔNG (TIẾNG ANH - NGHIÊM TÚC)
      toast.success("Request Successful", {
        description: "A verification code has been sent to your email.",
        duration: 4000, // Hiện lâu hơn chút để đọc
      })

      // Chuyển trang sau 1.5s
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(email) 
        }, 1500)
      }

    } catch (err: any) {
      console.error("API Error:", err)
      
      // Lấy thông báo lỗi từ Server (nếu Server trả về tiếng Anh thì tốt, không thì mình tự map)
      const serverMessage = err.response?.data?.message || "Unable to send verification email. Please try again later."
      
      setError(serverMessage)
      
      // THÔNG BÁO LỖI (TIẾNG ANH - NGHIÊM TÚC)
      toast.error("Request Failed", {
        description: serverMessage
      })

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
        onClick={() => alert("Redirect to Login")}
        disabled={isLoading}
        aria-label="Back to Login"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <div className="w-full max-w-md space-y-6 px-4">
        <div className="w-full py-6 text-center">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-[#BDCAEE] drop-shadow-md">
            Forgot Password
          </h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="inline-block font-bold text-sm tracking-wide ml-1 bg-transparent text-[#D8DFF5]"
            >
              EMAIL
            </Label>
            
            <Input 
              id="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError("") 
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
              placeholder="name@example.com" 
              type="email"
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
            className="w-full h-14 text-lg font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg uppercase tracking-wide flex items-center justify-center gap-2 bg-[#D8DFF5] text-[#3A5FCD]"
          >
            {isLoading ? "SENDING..." : "SUBMIT"}
          </Button>
        </div>
      </div>
    </div>
  )
}