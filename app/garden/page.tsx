"use client"

import { Cardo } from "next/font/google"
import Link from "next/link"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

function SeedlingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="rgba(125,160,120,0.15)" />
      <path d="M24 34V22" stroke="#7da078" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 26c-4-6-10-5-10-5s1 6 5 9c2.5 1.8 5 1 5 1" stroke="#7da078" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24 22c4-6 10-5 10-5s-1 6-5 9c-2.5 1.8-5 1-5 1" stroke="#7da078" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default function GardenLanding() {
  return (
    <div className={`${cardo.className} min-h-screen flex flex-col items-center justify-center px-4 relative`} style={{ background: "linear-gradient(180deg, #1a2332 0%, #1e2a3a 40%, #1a2332 100%)", lineHeight: 1.7 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${(i * 17.3) % 100}%`,
              left: `${(i * 23.7) % 100}%`,
              opacity: 0.2 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <SeedlingIcon />
        </div>

        <h1 className="text-5xl font-medium text-[#e8e0d4] mb-4" style={{ fontStyle: "italic" }}>
          The Garden
        </h1>

        <p className="text-[#a0a8b0] text-base mb-2">A private space for writers.</p>
        <p className="text-[#808890] text-sm mb-10">Sign in to tend your garden.</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/garden/signin"
            className="flex items-center gap-2 px-8 py-3 border border-[rgba(125,160,120,0.3)] rounded text-[#c0c8c0] text-sm hover:border-[rgba(125,160,120,0.6)] hover:text-white transition-all"
          >
            <ArrowRightIcon />
            Sign In
          </Link>
          <Link
            href="/garden/signup"
            className="flex items-center gap-2 px-8 py-3 border border-[rgba(125,160,120,0.3)] bg-[rgba(125,160,120,0.1)] rounded text-[#c0c8c0] text-sm hover:border-[rgba(125,160,120,0.6)] hover:text-white transition-all"
          >
            <UsersIcon />
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
