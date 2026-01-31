"use client"

import { useState } from "react"
import { Cardo } from "next/font/google"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] })

// Sample submission data
const initialSubmissions = {
  pending: [
    {
      id: 1,
      title: "Transit Elegies",
      author: "Sarah Chen",
      email: "sarah.chen@email.com",
      type: "poetry" as const,
      date: "Jan 28, 2026",
      unread: true,
      excerpt:
        "The subway lurches and I think of / how we measure time in stops / between here and wherever we're going...",
      content: `The subway lurches and I think of
how we measure time in stops
between here and wherever we're going.

Each platform a comma,
each tunnel a held breath,
each arrival a question
we answer with our feet.

Someone's coffee spills
in slow motion across the floor—
a small disaster
no one will remember
by the time we surface
into the day's bright amnesia.

The doors close. The doors open.
We step through portals
that lead to other portals
in an endless chain of leaving
and arriving and leaving again.

I have spent years
learning the rhythm of departure,
the particular music
of train wheels on tracks,
the way goodbye sounds
when it's muffled by
the hiss of hydraulic doors.

At Union Square, a woman
boards with a suitcase
and a dying plant.
She holds it like a child.

I wonder if she's learned
what I'm still learning—
that every journey
is also a form of staying,
that motion can be
its own kind of stillness,

that sometimes the only way
to remain yourself
is to keep moving.`,
    },
    {
      id: 2,
      title: "Between Platforms",
      author: "Marcus Williams",
      email: "m.williams@email.com",
      type: "prose" as const,
      date: "Jan 27, 2026",
      unread: true,
      excerpt:
        "She told me once that commuting is just rehearsal for leaving. I didn't understand then, staring at the blur of platforms...",
      content: `She told me once that commuting is just rehearsal for leaving. I didn't understand then, staring at the blur of platforms passing outside the window, each one a place I could have gotten off but didn't.

Now I think about it every time I board the train. The doors that close behind you. The moment when the train pulls away and you're committed to the motion, no longer here but not yet there.

Today a woman got on at 14th Street carrying a suitcase and a potted plant. The plant was too large, its leaves brushing against other passengers. She held it carefully, protectively, as if it were a child.

I wanted to ask her where she was going, this woman with her plant and her suitcase, leaving or arriving at some threshold I couldn't see. But the train was too loud, and the moment passed, and at Union Square she got off, disappearing into the crowd with her careful cargo.

I rode three more stops before I realized I'd missed my transfer.

Some days the commute feels like the only honest thing I do—this repeated motion between two fixed points, this daily practice of departure and return. No pretense. Just the mechanical rhythm of leaving and arriving, the body moving through space while the mind floats somewhere else entirely.

My father used to say that you could judge a city by its transit system. Not by its efficiency or cleanliness, but by the faces of its commuters. Whether they looked at each other or away. Whether they held doors or let them close.

By that measure, we're all leaving. We're all between platforms, suspended in the infrastructure of our daily migrations, learning how to be alone together.`,
    },
    {
      id: 3,
      title: "The Architecture of Waiting",
      author: "Jasmine Lee",
      email: "jasmine.lee@email.com",
      type: "essay" as const,
      date: "Jan 26, 2026",
      unread: false,
      excerpt:
        "There's a particular geometry to train stations—the way platforms stretch into distance, how benches face the tracks like supplicants...",
      content: `There's a particular geometry to train stations—the way platforms stretch into distance, how benches face the tracks like supplicants at an altar.... I've spent countless hours in these liminal spaces, studying the architecture of waiting. The yellow safety line that marks the boundary between patience and danger. The digital boards that promise arrivals in minutes that feel like hours.

Train stations are designed for movement, yet they demand stillness. Stand here. Wait there. Do not cross this line.

There's a woman I see most mornings at Penn Station. She arrives early, always wearing the same navy coat, and sits on the same bench facing Track 7. She never boards a train. I've been observing her for three months now, this ritual of arrival without departure.

I wonder what she's waiting for. Or if waiting itself has become the destination.

The French have a phrase: l'appel du vide—the call of the void. That strange pull you feel standing at the edge of something. At train stations, I feel its opposite: l'appel du mouvement—the call of motion. The magnetic pull of elsewhere.

But perhaps the woman in the navy coat understands something I'm still learning. That sometimes the bravest thing we can do is stay. To practice the difficult art of remaining in place while the world rushes past.

The architecture of waiting teaches us this: that platforms are not just places of departure, but of possibility. Every bench a potential story. Every arrival board a promise that could be kept or broken.

And sometimes, the journey is simply learning to sit still.`,
    },
    {
      id: 4,
      title: "Threshold / Body / Door",
      author: "Alex Rivera",
      email: "alex.r@email.com",
      type: "hybrid" as const,
      date: "Jan 25, 2026",
      unread: true,
      excerpt:
        "Every door is a question / you answer with your body. [A series of photographs follows: turnstiles, train doors, office entrances...]",
      content: `Every door is a question
you answer with your body.

[Photograph: Subway turnstile, 6:47 AM]

The body remembers
before the mind decides—
which pocket holds the MetroCard,
how much pressure to lean forward,
the exact angle of hip
to clear the rotating arms.

[Photograph: Train doors closing, motion blur]

In Japanese, the word for threshold
is shikii. It means
the boundary wood,
the place where inside
becomes outside
or outside becomes in.

[Photograph: Empty platform, doors about to close]

My therapist says I have
boundary issues.
I think she means
I've forgotten how to tell
where I end
and the world begins.

[Photograph: Reflection in train window at dusk]

Every morning, I practice:
Stand behind yellow line.
Wait for doors.
Step through.
Repeat.

[Photograph: Turnstile arms at rest, seen from below]

The doors close. The doors open.
The body moves through space
that is neither here nor there—
just the small deaths
of daily threshold crossings,
just the resurrections
of arrival.

[Photograph: Hand reaching for door as it closes]

Every door is a question.
Every crossing, an answer
the body gives
without permission.`,
    },
  ],
  underReview: [
    {
      id: 5,
      title: "Ghost Stations",
      author: "Thomas Park",
      email: "t.park@email.com",
      type: "prose" as const,
      date: "Jan 24, 2026",
      unread: false,
      excerpt: "In New York, there are stations that no longer exist...",
      content: "Ghost stations content...",
    },
  ],
  accepted: [] as Submission[],
  scheduled: [] as Submission[],
  rejected: [] as Submission[],
}

type SubmissionType = "poetry" | "prose" | "essay" | "hybrid"
type QueueType = "pending" | "underReview" | "accepted" | "scheduled" | "rejected"

interface Submission {
  id: number
  title: string
  author: string
  email: string
  type: SubmissionType
  date: string
  unread: boolean
  excerpt: string
  content: string
}

const queueDisplayNames: Record<QueueType, string> = {
  pending: "Pending Review",
  underReview: "Under Review",
  accepted: "Accepted",
  scheduled: "Scheduled",
  rejected: "Rejected",
}

const tagStyles: Record<SubmissionType, string> = {
  poetry: "bg-[rgba(42,127,141,0.15)] text-[#2a7f8d]",
  prose: "bg-[rgba(216,136,71,0.15)] text-[#a85e2a]",
  essay: "bg-[rgba(45,125,78,0.15)] text-[#2d7d4e]",
  hybrid: "bg-[rgba(192,21,47,0.15)] text-[#c0152f]",
}

export default function EditorDashboard() {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [currentQueue, setCurrentQueue] = useState<QueueType>("pending")
  const [currentFilter, setCurrentFilter] = useState<"all" | SubmissionType>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editorNotes, setEditorNotes] = useState("")
  const [publishImmediately, setPublishImmediately] = useState(false)

  const filteredSubmissions =
    currentFilter === "all"
      ? submissions[currentQueue]
      : submissions[currentQueue].filter((s) => s.type === currentFilter)

  const openSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsModalOpen(true)
    setEditorNotes("")
    setPublishImmediately(false)

    // Mark as read
    if (submission.unread) {
      setSubmissions((prev) => ({
        ...prev,
        [currentQueue]: prev[currentQueue].map((s) => (s.id === submission.id ? { ...s, unread: false } : s)),
      }))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSubmission(null)
  }

  const moveSubmission = (id: number, toQueue: QueueType) => {
    let movedSubmission: Submission | null = null

    setSubmissions((prev) => {
      const newSubmissions = { ...prev }

      // Find and remove from current queue
      for (const queue of Object.keys(newSubmissions) as QueueType[]) {
        const index = newSubmissions[queue].findIndex((s) => s.id === id)
        if (index !== -1) {
          movedSubmission = newSubmissions[queue][index]
          newSubmissions[queue] = newSubmissions[queue].filter((s) => s.id !== id)
          break
        }
      }

      // Add to new queue
      if (movedSubmission) {
        newSubmissions[toQueue] = [...newSubmissions[toQueue], movedSubmission]
      }

      return newSubmissions
    })
  }

  const quickAccept = (id: number) => {
    if (confirm("Accept this submission?\n\n(You can add notes by opening the full review)")) {
      moveSubmission(id, "accepted")
    }
  }

  const quickReject = (id: number) => {
    if (confirm("Reject this submission?\n\nConsider opening the full review to add feedback for the writer.")) {
      moveSubmission(id, "rejected")
    }
  }

  const acceptSubmission = () => {
    if (!selectedSubmission) return
    moveSubmission(selectedSubmission.id, publishImmediately ? "scheduled" : "accepted")
    closeModal()
  }

  const rejectSubmission = () => {
    if (!selectedSubmission) return
    if (!editorNotes.trim()) {
      if (!confirm("No feedback provided. Reject without feedback?")) {
        return
      }
    }
    moveSubmission(selectedSubmission.id, "rejected")
    closeModal()
  }

  const getCounts = () => ({
    pending: submissions.pending.length,
    underReview: submissions.underReview.length,
    accepted: submissions.accepted.length,
    scheduled: submissions.scheduled.length,
    rejected: submissions.rejected.length,
  })

  const counts = getCounts()
  const totalSubmissions = Object.values(submissions).reduce((sum, arr) => sum + arr.length, 0)
  const reviewed = submissions.accepted.length + submissions.rejected.length
  const acceptanceRate = reviewed > 0 ? Math.round((submissions.accepted.length / reviewed) * 100) : 0

  return (
    <div className={`${cardo.className} min-h-screen bg-[#fefefe] text-[#1a1a1a]`} style={{ lineHeight: 1.7 }}>
      {/* Header */}
      <header className="bg-[#fefefe] px-8 py-6 sticky top-0 z-50 border-b border-[#e8e8e8]">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-medium tracking-tight text-[#1a1a1a]">Page Gallery</span>
            <span className="ml-3 px-3 py-1 bg-[#1a1a1a] text-white text-xs rounded uppercase tracking-wider">
              Editor
            </span>
          </div>
          <nav className="flex gap-8 items-center">
            <button className="text-[#1a1a1a] text-sm">Dashboard</button>
            <button className="text-[#999999] hover:text-[#1a1a1a] text-sm transition-colors">Analytics</button>
            <button className="text-[#999999] hover:text-[#1a1a1a] text-sm transition-colors">Settings</button>
            <div className="flex items-center gap-3 px-4 py-2 border border-[#e8e8e8] rounded cursor-pointer hover:border-[#1a1a1a] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-medium">
                EH
              </div>
              <span className="text-sm">Editor</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 py-12 grid grid-cols-[280px_1fr] gap-12">
        {/* Sidebar */}
        <aside className="sticky top-28 h-fit">
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-widest text-[#999999] mb-4 font-medium">Submission Queue</h3>
            {(["pending", "underReview", "accepted", "scheduled", "rejected"] as QueueType[]).map((queue) => (
              <button
                key={queue}
                onClick={() => setCurrentQueue(queue)}
                className={`w-full py-3 text-left flex items-center justify-between mb-2 transition-colors ${
                  currentQueue === queue ? "text-[#1a1a1a] font-medium" : "text-[#999999] hover:text-[#1a1a1a]"
                }`}
              >
                <span>{queueDisplayNames[queue]}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    queue === "pending" && counts[queue] > 0 ? "bg-[#d88847] text-white" : "bg-[#1a1a1a] text-white"
                  }`}
                >
                  {counts[queue]}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#e8e8e8] p-6">
            <h4 className="text-sm uppercase tracking-wider text-[#999999] mb-4">This Month</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Submissions</span>
                <span className="font-medium text-[#1a1a1a]">{totalSubmissions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Reviewed</span>
                <span className="font-medium text-[#1a1a1a]">{reviewed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Acceptance Rate</span>
                <span className="font-medium text-[#1a1a1a]">{acceptanceRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. Review Time</span>
                <span className="font-medium text-[#1a1a1a]">8 days</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="bg-white border border-[#e8e8e8] p-10 min-h-[600px]">
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#e8e8e8]">
            <h2 className="text-2xl font-medium text-[#1a1a1a]">{queueDisplayNames[currentQueue]}</h2>
            <div className="flex gap-2">
              {(["all", "poetry", "prose", "essay"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCurrentFilter(filter)}
                  className={`px-4 py-2 border rounded text-sm transition-all ${
                    currentFilter === filter
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-transparent border-[#e8e8e8] hover:border-[#1a1a1a]"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-6">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 text-[#999999]">
                <div className="text-6xl mb-4 opacity-30">
                  {currentQueue === "pending"
                    ? "📝"
                    : currentQueue === "underReview"
                      ? "👁️"
                      : currentQueue === "accepted"
                        ? "✓"
                        : currentQueue === "scheduled"
                          ? "📅"
                          : "📋"}
                </div>
                <h3 className="text-xl mb-2 text-[#666666]">
                  {currentQueue === "pending"
                    ? "No Pending Submissions"
                    : currentQueue === "underReview"
                      ? "No Submissions Under Review"
                      : currentQueue === "accepted"
                        ? "No Accepted Submissions"
                        : currentQueue === "scheduled"
                          ? "No Scheduled Publications"
                          : "No Rejected Submissions"}
                </h3>
                <p>
                  {currentQueue === "pending"
                    ? "All submissions have been reviewed"
                    : currentQueue === "underReview"
                      ? "Move submissions here when actively reviewing"
                      : currentQueue === "accepted"
                        ? "Accepted pieces will appear here"
                        : currentQueue === "scheduled"
                          ? "Schedule accepted pieces for publication"
                          : "Rejected submissions are archived here"}
                </p>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => openSubmission(submission)}
                  className={`border border-[#e8e8e8] p-6 cursor-pointer transition-all hover:border-[#1a1a1a] hover:shadow-sm ${
                    submission.unread ? "border-l-[3px] border-l-[#d88847]" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">{submission.title}</h3>
                      <div className="text-sm text-[#999999]">
                        by {submission.author} • {submission.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${tagStyles[submission.type]}`}>
                        {submission.type}
                      </span>
                      <span className="text-xs text-[#999999]">{submission.date}</span>
                    </div>
                  </div>
                  <p className="text-[#666666] italic mb-4 line-clamp-2">{`"${submission.excerpt}"`}</p>
                  <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openSubmission(submission)}
                      className="px-4 py-2 border border-[#e8e8e8] rounded text-sm hover:bg-[#f8f8f8] hover:border-[#1a1a1a] transition-all"
                    >
                      Read Full
                    </button>
                    {currentQueue === "pending" && (
                      <>
                        <button
                          onClick={() => quickAccept(submission.id)}
                          className="px-4 py-2 bg-[#2d7d4e] text-white border border-[#2d7d4e] rounded text-sm hover:bg-[#256638] transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => quickReject(submission.id)}
                          className="px-4 py-2 bg-[#c0152f] text-white border border-[#c0152f] rounded text-sm hover:bg-[#9a1126] transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-8 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white max-w-[900px] w-full max-h-[90vh] overflow-y-auto border border-[#e8e8e8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-[#e8e8e8] sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">{selectedSubmission.title}</h2>
                  <div className="text-sm text-[#999999]">
                    <span>by {selectedSubmission.author}</span> •{" "}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${tagStyles[selectedSubmission.type]}`}>
                      {selectedSubmission.type}
                    </span>{" "}
                    • <span>{selectedSubmission.date}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-2xl text-[#999999] hover:text-[#1a1a1a] transition-colors w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="whitespace-pre-wrap text-[#1a1a1a] leading-relaxed mb-8">{selectedSubmission.content}</div>

              <div className="bg-[#f8f8f8] border border-[#e8e8e8] p-6 mb-8">
                <h4 className="font-semibold text-[#1a1a1a] mb-4">Editorial Notes</h4>
                <textarea
                  value={editorNotes}
                  onChange={(e) => setEditorNotes(e.target.value)}
                  placeholder="Add notes for the writer or other editors..."
                  className="w-full min-h-[120px] p-3 border border-[#e8e8e8] rounded text-sm resize-y bg-white focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-[#e8e8e8] bg-[#f8f8f8] flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                Publish immediately upon acceptance
              </label>
              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-white text-[#1a1a1a] border border-[#e8e8e8] rounded text-sm hover:bg-[#f8f8f8] hover:border-[#1a1a1a] transition-all"
                >
                  Close
                </button>
                <button
                  onClick={rejectSubmission}
                  className="px-6 py-3 bg-[#c0152f] text-white border border-[#c0152f] rounded text-sm hover:bg-[#9a1126] transition-colors"
                >
                  Reject with Feedback
                </button>
                <button
                  onClick={acceptSubmission}
                  className="px-6 py-3 bg-[#2d7d4e] text-white border border-[#2d7d4e] rounded text-sm hover:bg-[#256638] transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
