'use client'

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function SignupForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState("")

  function validateForm() {
    const errors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      errors.email = "Email wajib diisi."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Format email tidak valid."
    }

    if (!password) {
      errors.password = "Password wajib diisi."
    } else if (password.length < 8) {
      errors.password = "Password minimal 8 karakter."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!validateForm()) return

    setLoading(true);
    setSuccess("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.code === "user_already_exists") {
        setError("Email sudah terdaftar"); 
      } else { 
        setError("Pendaftaran gagal. Silakan coba lagi."); 
      }
      setLoading(false);
      return;
    }

    setSuccess("Pendaftaran berhasil");

    setLoading(false);

    setTimeout(() => {
      router.push("/signin")
    }, 2000)
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full mx-auto font-sans">
        <div className="w-full text-center mb-6">
          <h1 className="mb-2 text-3xl md:text-4xl font-semibold text-gray-800">
            Buat Akun
          </h1>
          <p className="text-sm text-gray-500">
            Mulai catat utang piutangmu
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm mx-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
              <span>{success}</span>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Masukkan email"
            />
            {fieldErrors.email && (
              <span className="mt-1 text-xs text-red-500">{fieldErrors.email}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
                }}
                className={`w-full border rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.password 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="buat password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="mt-1 text-xs text-red-500">{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer transition-colors">
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>

          <div>
            <p className="text-sm font-normal text-center text-gray-700 sm:text-start">
              Saya punya akun? {""}
              <Link
                href="/signin"
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Masuk
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}