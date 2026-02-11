"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cardo } from "next/font/google"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      setLoading(false)
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/garden/dashboard")
  }

  const handleGitHubSignIn = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      alert("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/garden` },
    })
  }

  return (
    <div className={`${cardo.className} min-h-screen bg-[#fefefe] text-[#1a1a1a] flex flex-col items-center justify-center px-4`} style={{ lineHeight: 1.7 }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Page Gallery</h1>
          <p className="text-sm text-[#999999]">Sign in to your account</p>
        </div>

        <div className="border border-[#e8e8e8] bg-white p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-[#666666] mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#e8e8e8] rounded text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-[#666666] mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#e8e8e8] rounded text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="Your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a1a1a] text-white rounded text-sm font-medium hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#e8e8e8]" />
            <span className="text-xs text-[#999999] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#e8e8e8]" />
          </div>

          {/* GitHub OAuth */}
          <button
            onClick={handleGitHubSignIn}
            className="w-full py-3 bg-[#24292f] text-white rounded text-sm font-medium hover:bg-[#1b1f23] transition-colors flex items-center justify-center gap-2"
          >
            <GitHubIcon />
            Sign in with GitHub
          </button>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#e8e8e8]" />
            <span className="text-xs text-[#999999] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#e8e8e8]" />
          </div>

          {/* Continue as Guest */}
          <Link
            href="/"
            className="w-full py-3 border border-[#e8e8e8] rounded text-sm text-[#666666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors flex items-center justify-center"
          >
            Continue as Guest
          </Link>
        </div>

        <p className="text-center text-sm text-[#999999] mt-6">
          {"Don't have an account? "}
          <Link href="/signup" className="text-[#1a1a1a] underline underline-offset-2 hover:text-[#333333]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
