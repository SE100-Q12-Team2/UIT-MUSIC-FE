import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bgImage from "@/assets/forgot-password-bg.jpg"
import { toast } from "sonner"
import axios from "axios"

interface ResetPasswordProps {
  email?: string;
  code?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function ResetPassword({ code, onBack, onSuccess }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const API_URL = "https://uit-music-production.up.railway.app/auth/reset-password"

  const handleSubmit = async () => {
    setError("")
    if (!newPassword || !confirmPassword) return setError("Please fill all fields")
    if (newPassword.length < 6) return setError("Password too short (min 6 chars)")
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await axios.post(API_URL, {
        resetToken: code,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword
      })

      toast.success("Success", { description: "Password reset successful", duration: 3000 })
      if (onSuccess) setTimeout(() => onSuccess(), 1500)

    } catch (err: any) {
      console.error("Error:", err)
      const serverMsg = err.response?.data?.description || "Invalid OTP or request failed."
      
      if (serverMsg.toLowerCase().includes("otp")) {
        setError("Invalid OTP Code. Please go back and try again.")
        toast.error("Failed", { description: "Incorrect verification code." })
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
        onClick={onBack} 
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