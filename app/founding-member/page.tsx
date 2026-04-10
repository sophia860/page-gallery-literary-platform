"use client";

import { useState, useEffect } from "react";
import { Card } from "next/font/google";
import { Button } from "@radix-ui/react-slot";
import { Label } from "@radix-ui/react-label";
import { createClient } from "@supabase/supabase-js";

type Tier = "seed" | "sprout" | "bloom" | "patron";

interface FoundingMemberData {
  tier: Tier;
  pledge_amount: number;
  display_name: string;
  message: string | null;
  is_anonymous: boolean;
  status: string;
}

const TIERS = [
  {
    id: "seed" as Tier,
    name: "Seed",
    min: 25,
    description: "Help plant the first seeds of The Page Gallery. Early supporter status + your name in the founders’ garden.",
    perks: [
      "Founders’ garden listing (unless anonymous)",
      "Launch updates newsletter",
      "1 month free Premium Writer subscription"
    ]
  },
  {
    id: "sprout" as Tier,
    name: "Sprout",
    min: 75,
    description: "Nurture our platform as it grows. All Seed perks + bonus submission credits.",
    perks: [
      "All Seed perks",
      "3 months free Premium Writer subscription",
      "5 submission credits (redeemable after launch)",
      "Featured in Sprout supporters section"
    ]
  },
  {
    id: "bloom" as Tier,
    name: "Bloom",
    min: 150,
    description: "Watch The Page Gallery blossom. Lifetime access + early feature previews.",
    perks: [
      "All Sprout perks",
      "6 months free Premium Writer subscription",
      "Beta access to new features",
      "Founding member badge (visible on profile)",
      "Priority support"
    ]
  },
  {
    id: "patron" as Tier,
    name: "Patron",
    min: 500,
    description: "Become a cornerstone patron. Lifetime premium + influence on platform development.",
    perks: [
      "All Bloom perks",
      "Lifetime Premium Writer subscription",
      "Quarterly virtual roundtable with the founder",
      "Input on editorial features roadmap",
      "Patron’s Circle listing with custom bio"
    ]
  }
];

export default function FoundingMemberPage() {
  const [selectedTier, setSelectedTier] = useState<Tier>("seed");
  const [customAmount, setCustomAmount] = useState<number>(25);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<FoundingMemberData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch existing pledge on mount
    async function fetchPledge() {
      try {
        const res = await fetch("/api/founding-member");
        if (res.ok) {
          const data = await res.json();
          if (data.founding_member) {
            setExisting(data.founding_member);
            setSelectedTier(data.founding_member.tier);
            setCustomAmount(data.founding_member.pledge_amount);
            setDisplayName(data.founding_member.display_name || "");
            setMessage(data.founding_member.message || "");
            setIsAnonymous(data.founding_member.is_anonymous);
          }
        }
      } catch (err) {
        console.error("Failed to load existing pledge:", err);
      }
    }

    fetchPledge();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/founding-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          pledge_amount: customAmount,
          display_name: displayName,
          message,
          is_anonymous: isAnonymous,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      } else {
        alert("Pledge saved! Thank you for supporting The Page Gallery.");
        const data = await res.json();
        setExisting(data.founding_member);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTierData = TIERS.find((t) => t.id === selectedTier)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-amber-900 mb-4">
            Become a Founding Member
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Support The Page Gallery in its earliest days and gain lifetime
            access, exclusive perks, and a place in our founding story.
          </p>
        </header>

        {existing && existing.status !== "pledged" && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Your pledge has been confirmed! Thank you for being a founding member.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => {
                setSelectedTier(tier.id);
                setCustomAmount(tier.min);
              }}
              className={`cursor-pointer rounded-lg border-2 p-6 transition ${
                selectedTier === tier.id
                  ? "border-amber-600 bg-amber-50 shadow-lg"
                  : "border-gray-300 bg-white hover:border-amber-400"
              }`}
            >
              <h3 className="text-2xl font-bold text-amber-900 mb-2">
                {tier.name}
              </h3>
              <p className="text-3xl font-bold text-amber-600 mb-3">
                £{tier.min}+
              </p>
              <p className="text-sm text-gray-700 mb-4">{tier.description}</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Your Pledge
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pledge Amount (min £{selectedTierData.min})
            </label>
            <input
              type="number"
              min={selectedTierData.min}
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-4 py-2 text-lg font-bold"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name (public, unless you choose anonymous)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name or pseudonym"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional — will be visible in Founders’ Garden)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share why you’re supporting The Page Gallery..."
              className="w-full border border-gray-300 rounded px-4 py-2 h-24"
              maxLength={280}
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Make my pledge anonymous (your name will not be displayed)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving..."
              : existing
              ? "Update Pledge"
              : "Pledge Now"}
          </button>

          {existing && existing.status === "pledged" && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              You can update your pledge at any time before we process payments.
            </p>
          )}
        </form>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-2">
            What happens next?
          </h3>
          <ol className="text-sm text-gray-700 space-y-2">
            <li>
              <strong>1. Pledge now:</strong> Your pledge is recorded but not
              charged yet.
            </li>
            <li>
              <strong>2. Final confirmation:</strong> We’ll send you a payment
              link via email before launch.
            </li>
            <li>
              <strong>3. Launch:</strong> Once we go live, your perks activate
              and your name appears in the Founders’ Garden.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
