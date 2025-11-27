import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import ForgotPassword from "@/features/auth/pages/ForgotPassword"
import EnterCode from "@/features/auth/pages/EnterCode"
import ResetPassword from "@/features/auth/pages/ResetPassword"

function App() {
  // Quản lý trạng thái màn hình
  const [currentScreen, setCurrentScreen] = useState<'forgot' | 'code' | 'reset' | 'login'>('forgot')
  
  // Lưu dữ liệu tạm để truyền giữa các bước
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  // Màn hình Login giả lập (Để test quay về)
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a2a] text-white space-y-6">
        <h1 className="text-4xl font-bold text-[#BDCAEE]">LOGIN SCREEN</h1>
        <p className="text-gray-400">Password reset successful!</p>
        <button 
          className="px-8 py-3 bg-[#D8DFF5] text-[#3A5FCD] font-bold rounded-xl hover:opacity-90 transition-all"
          onClick={() => {
            setEmail("")
            setCode("")
            setCurrentScreen('forgot')
          }}
        >
          Back to Forgot Password
        </button>
        <Toaster position="top-right" richColors />
      </div>
    )
  }

  return (
    <>
      {/* BƯỚC 1: NHẬP EMAIL */}
      {currentScreen === 'forgot' && (
        <ForgotPassword 
          onSuccess={(emailInput) => {
            setEmail(emailInput)
            setCurrentScreen('code')
          }}
        />
      )}

      {/* BƯỚC 2: NHẬP CODE */}
      {currentScreen === 'code' && (
        <EnterCode 
          email={email} 
          onBack={() => setCurrentScreen('forgot')}
          onSuccess={(validCode) => {
            setCode(validCode)
            setCurrentScreen('reset')
          }}
        />
      )}

      {/* BƯỚC 3: ĐỔI MẬT KHẨU */}
      {currentScreen === 'reset' && (
        <ResetPassword 
          email={email}
          code={code}
          onBack={() => setCurrentScreen('code')}
          onSuccess={() => setCurrentScreen('login')}
        />
      )}

      {/* Loa thông báo toàn cục */}
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App