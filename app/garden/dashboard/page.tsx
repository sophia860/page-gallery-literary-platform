"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Cardo } from "next/font/google"
import Link from "next/link"
import { createClient, User } from "@supabase/supabase-js"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export default function GardenDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const init = async () => {
      if (!supabaseUrl || !supabaseAnonKey) {
        setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
        setLoading(false)
        return
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      setLoading(false)
      if (!data.user) {
        router.replace("/garden/signin")
      }
    }
    init()
  }, [router])

  const handleSignOut = async () => {
    if (!supabaseUrl || !supabaseAnonKey) return
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.signOut()
    router.replace("/garden/signin")
  }

  if (loading) {
    return (
      <div className={`${cardo.className} min-h-screen flex items-center justify-center bg-[#f5f0ea] text-[#2a2a2a]`}>
        <div>Loading your garden…</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={`${cardo.className} min-h-screen flex flex-col bg-[#f5f0ea] text-[#2a2a2a]`}>
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d4] bg-white/70 backdrop-blur">
        <Link href="/garden" className="text-[#7da078]" style={{ fontStyle: "italic" }}>
          garden
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#666]">{user.email}</span>
          <button onClick={handleSignOut} className="px-3 py-1.5 border border-[#d4cdc4] rounded hover:border-[#999]">
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl mb-4" style={{ fontStyle: "italic" }}>Your Garden</h1>
          <p className="text-[#555] mb-6">Welcome back. Start writing or review your recent plantings.</p>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="border border-[#d4cdc4] bg-white rounded-lg p-6">
              <h2 className="text-lg mb-3">New Planting</h2>
              <textarea className="w-full h-32 border border-[#d4cdc4] rounded p-3 text-sm" placeholder="Write here…" />
              <div className="mt-3 flex justify-end">
                <button className="px-4 py-2 bg-[#b07d4f] text-white rounded text-sm hover:bg-[#96693f]">Publish</button>
              </div>
            </section>
            <section className="border border-[#d4cdc4] bg-white rounded-lg p-6">
              <h2 className="text-lg mb-3">Recent Plantings</h2>
              <p className="text-sm text-[#777]">Coming soon…</p>
            </section>
          </div>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-50 text-red-700 border border-red-200 rounded px-4 py-2 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
