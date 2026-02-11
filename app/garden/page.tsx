"use client"

import { useState } from "react"
import { Cardo } from "next/font/google"
import Link from "next/link"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

export default function GardenPage() {
  const [content, setContent] = useState("")

  return (
    <div className={`${cardo.className} min-h-screen bg-[#fefefe] text-[#1a1a1a]`} style={{ lineHeight: 1.7 }}>
      <header className="bg-[#fefefe] px-8 py-6 sticky top-0 z-50 border-b border-[#e8e8e8]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-medium tracking-tight text-[#1a1a1a] hover:opacity-70 transition-opacity">
              Page Gallery
            </Link>
            <span className="px-3 py-1 bg-[#2d7d4e] text-white text-xs rounded uppercase tracking-wider">
              Garden
            </span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="/garden" className="text-[#1a1a1a] text-sm font-medium">My Garden</Link>
            <Link href="/" className="text-[#999999] hover:text-[#1a1a1a] text-sm transition-colors">Gallery</Link>
            <Link
              href="/signin"
              className="text-sm text-[#999999] hover:text-[#1a1a1a] transition-colors"
            >
              Sign Out
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-medium mb-2">Your Garden</h1>
          <p className="text-[#999999] text-sm">A private space for your writing. Tend your words here.</p>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-10">
          <div>
            <div className="border border-[#e8e8e8] bg-white p-8 mb-8">
              <h2 className="text-lg font-medium mb-4">New Entry</h2>
              <input
                type="text"
                placeholder="Title your piece..."
                className="w-full px-4 py-3 border border-[#e8e8e8] rounded text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors mb-4"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing..."
                rows={12}
                className="w-full px-4 py-3 border border-[#e8e8e8] rounded text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-[#e8e8e8] rounded text-sm bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors">
                    <option>Poetry</option>
                    <option>Prose</option>
                    <option>Essay</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 border border-[#e8e8e8] rounded text-sm text-[#666666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                    Save Draft
                  </button>
                  <button className="px-6 py-2 bg-[#1a1a1a] text-white rounded text-sm font-medium hover:bg-[#333333] transition-colors">
                    Plant in Garden
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-[#e8e8e8] bg-white p-8">
              <h2 className="text-lg font-medium mb-6">Your Plantings</h2>
              <div className="text-center py-12 text-[#999999]">
                <p className="text-sm mb-2">Your garden is fresh soil.</p>
                <p className="text-sm">Start writing above to plant your first piece.</p>
              </div>
            </div>
          </div>

          <aside className="sticky top-28 h-fit space-y-6">
            <div className="border border-[#e8e8e8] bg-white p-6">
              <h3 className="text-xs uppercase tracking-widest text-[#999999] mb-4 font-medium">Garden Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Plantings</span>
                  <span className="font-medium text-[#1a1a1a]">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Drafts</span>
                  <span className="font-medium text-[#1a1a1a]">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discovered</span>
                  <span className="font-medium text-[#1a1a1a]">0</span>
                </div>
              </div>
            </div>

            <div className="border border-[#e8e8e8] bg-white p-6">
              <h3 className="text-xs uppercase tracking-widest text-[#999999] mb-4 font-medium">How It Works</h3>
              <div className="space-y-3 text-sm text-[#666666]">
                <p>Write freely in your garden. Editors browse community gardens looking for exceptional work.</p>
                <p>When your writing catches an editor's eye, it may be selected for the curated gallery collection.</p>
                <p>You don't submit. You don't query. You just write.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
