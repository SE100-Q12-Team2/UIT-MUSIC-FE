import { useState } from "react"
import { Toaster } from "@/components/ui/sonner"
import ForgotPassword from "@/features/auth/pages/ForgotPassword"
import EnterCode from "@/features/auth/pages/EnterCode"
import ResetPassword from "@/features/auth/pages/ResetPassword"

function App() {
  const [currentScreen, setCurrentScreen] = useState<'forgot' | 'code' | 'reset' | 'login'>('forgot')
  const [email, setEmail] = useState("")

  // Giả lập trang Login đơn giản để test luồng quay về
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
        <h1 className="text-4xl font-bold text-[#BDCAEE]">LOGIN PAGE</h1>
        <p>Password reset successful!</p>
        <button 
          className="px-6 py-2 bg-[#D8DFF5] text-[#3A5FCD] font-bold rounded-xl"
          onClick={() => setCurrentScreen('forgot')}
        >
          Test Again (Forgot Password)
        </button>
        <Toaster position="top-right" richColors />
      </div>
    )
  }

  return (
    <>
      {/* 1. MÀN HÌNH QUÊN MẬT KHẨU */}
      {currentScreen === 'forgot' && (
        <ForgotPassword 
          onSuccess={(emailInput) => {
            setEmail(emailInput)
            setCurrentScreen('code')
          }}
        />
      )}

      {/* 2. MÀN HÌNH NHẬP MÃ */}
      {currentScreen === 'code' && (
        <EnterCode 
          email={email} 
          onBack={() => setCurrentScreen('forgot')}
          onSuccess={() => setCurrentScreen('reset')}
        />
      )}

      {/* 3. MÀN HÌNH ĐỔI MẬT KHẨU */}
      {currentScreen === 'reset' && (
        <ResetPassword 
          email={email}
          onBack={() => setCurrentScreen('code')}
          onSuccess={() => {
            // Đổi mật khẩu thành công -> Chuyển sang trang Login
            setCurrentScreen('login')
          }}
        />
      )}

      <Toaster position="top-right" richColors />
    </>
  )
}

export default App