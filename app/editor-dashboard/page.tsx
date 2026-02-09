"use client"

import { useState, useEffect } from "react"
import { Cardo } from "next/font/google"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

interface Submission {
  id: string
  title: string
  author_name: string
  genre: string
  word_count: number
  content: string
  status: string
  created_at: string
}

interface Profile {
  id: string
  first_name: string
  last_name: string
  role: string
}

export default function EditorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    const initDashboard = async () => {
      if (!supabaseUrl || !supabaseAnonKey) {
        setLoading(false)
        return
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData)
        }
        
        const { data: submissionsData } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (submissionsData) {
          setSubmissions(submissionsData)
        }
      }
      
      setLoading(false)
    }
    
    initDashboard()
  }, [])

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    if (!supabaseUrl || !supabaseAnonKey) return
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const { error } = await supabase
      .from('submissions')
      .update({ status: newStatus })
      .eq('id', submissionId)
    
    if (!error) {
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: newStatus } : sub
      ))
      setSelectedSubmission(null)
    }
  }

  const handleSignOut = async () => {
    if (!supabaseUrl || !supabaseAnonKey) return
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    await supabase.auth.signOut()
    window.location.href = '/signin'
  }

  if (loading) {
    return (
      <div className={`${cardo.className} min-h-screen bg-[#fefefe] text-[#1a1a1a] flex items-center justify-center`}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`${cardo.className} min-h-screen bg-[#fefefe] text-[#1a1a1a] flex items-center justify-center`}>
        <div className="text-center">
          <p className="mb-4">Please sign in to access the editor dashboard.</p>
          <Link href="/signin" className="text-[#2a7f8d] hover:underline">Go to Sign In</Link>
        </div>
      </div>
    )
  }

  const firstName = profile?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || 'Editor'

  return (
    <div className={`${cardo.className} min-h-screen bg-[#fefefe] text-[#1a1a1a]`}>
      <header className="border-b border-[#e0e0e0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold">Page Gallery</Link>
            <nav className="flex gap-4">
              <Link href="/editor-dashboard" className="text-[#2a7f8d] font-medium">Dashboard</Link>
              <Link href="/analytics" className="text-[#666] hover:text-[#1a1a1a]">Analytics</Link>
              <Link href="/settings" className="text-[#666] hover:text-[#1a1a1a]">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#666]">Welcome, {firstName}</span>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#333]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Submissions</h1>
        
        {submissions.length === 0 ? (
          <p className="text-[#666]">No submissions yet.</p>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div 
                key={submission.id}
                className="border border-[#e0e0e0] rounded-lg p-6 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{submission.title}</h2>
                    <p className="text-[#666]">by {submission.author_name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-[#999]">
                      <span>{submission.genre}</span>
                      <span>{submission.word_count} words</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        submission.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="px-4 py-2 border border-[#2a7f8d] text-[#2a7f8d] rounded hover:bg-[#2a7f8d] hover:text-white"
                    >
                      Read Full
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={submission.status === 'accepted'}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={submission.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <p className="text-[#666] line-clamp-3">{submission.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedSubmission.title}</h2>
                <p className="text-[#666]">by {selectedSubmission.author_name}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-2xl text-[#666] hover:text-[#1a1a1a]"
              >
                ×
              </button>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{selectedSubmission.content}</p>
            </div>
            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'accepted')}
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'rejected')}
                className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
