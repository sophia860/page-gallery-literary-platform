"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cardo } from "next/font/google"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

function SeedlingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 34V22" stroke="#7da078" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 26c-4-6-10-5-10-5s1 6 5 9c2.5 1.8 5 1 5 1" stroke="#7da078" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24 22c4-6 10-5 10-5s-1 6-5 9c-2.5 1.8-5 1-5 1" stroke="#7da078" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function GardenSignUp() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      setLoading(false)
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/garden/dashboard")
  }

  const handleGitHub = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Supabase is not configured.")
      return
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/garden/dashboard` },
    })
  }

  const handleGoogle = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Supabase is not configured.")
      return
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/garden/dashboard` },
    })
  }

  return (
    <div className={`${cardo.className} min-h-screen flex flex-col items-center justify-center px-4 relative`} style={{ background: "linear-gradient(180deg, #f5f0ea 0%, #ede7df 100%)", lineHeight: 1.7 }}>
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1 px-4 py-2 border border-[#d4cdc4] rounded text-sm text-[#666] hover:border-[#999] hover:text-[#333] transition-all bg-white"
      >
        <ChevronLeftIcon />
        Back to Gallery
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <SeedlingIcon />
            <span className="text-lg text-[#7da078]" style={{ fontStyle: "italic" }}>garden</span>
          </div>
          <h1 className="text-3xl font-medium text-[#2a2a2a] mb-2" style={{ fontStyle: "italic" }}>Create your account</h1>
          <p className="text-sm text-[#999]">Plant your first seed</p>
        </div>

        <div className="border border-[#d4cdc4] bg-white rounded-lg p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm text-[#555] mb-1.5">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[#d4cdc4] rounded text-sm bg-white focus:outline-none focus:border-[#7da078] transition-colors"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-[#555] mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#d4cdc4] rounded text-sm bg-white focus:outline-none focus:border-[#7da078] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-[#555] mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#d4cdc4] rounded text-sm bg-white focus:outline-none focus:border-[#7da078] transition-colors"
                placeholder="Create a password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#b07d4f] text-white rounded text-sm font-medium hover:bg-[#96693f] transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Garden Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#e8e0d4]" />
            <span className="text-xs text-[#999] tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-[#e8e0d4]" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 border border-[#d4cdc4] rounded text-sm text-[#555] hover:border-[#999] transition-colors flex items-center justify-center gap-2 bg-white"
            >
              {/* Simple G icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleGitHub}
              className="w-full py-3 border border-[#d4cdc4] rounded text-sm text-[#555] hover:border-[#999] transition-colors flex items-center justify-center gap-2 bg-white"
            >
              {/* Simple GitHub icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-[#999] mt-6">
          Already have a garden? {""}
          <Link href="/garden/signin" className="text-[#b07d4f] hover:text-[#8a5f3a] transition-colors">
            Return to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
