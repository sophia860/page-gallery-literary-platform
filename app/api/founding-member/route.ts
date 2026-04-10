import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// ── Founding Member API Route ──────────────────────────────────────────────
// GET  /api/founding-member        → fetch current user's pledge (if any)
// POST /api/founding-member        → create or update a pledge
// DELETE /api/founding-member      → withdraw a pledge (before processing)
// ──────────────────────────────────────────────────────────────────────────

function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookie writes are read-only; ignore
          }
        },
      },
    }
  );
}

/** GET — return the authenticated user's founding member record */
export async function GET() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('founding_members')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = row not found — that is fine
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ founding_member: data ?? null });
}

/** POST — create or update a founding member pledge */
export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const body = await req.json();
  const { tier, pledge_amount, display_name, message, is_anonymous } = body;

  // ── Validation ────────────────────────────────────────────────────────
  const VALID_TIERS = ['seed', 'sprout', 'bloom', 'patron'] as const;
  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json(
      { error: 'Invalid tier. Must be one of: seed, sprout, bloom, patron' },
      { status: 400 }
    );
  }

  const TIER_MINIMUMS: Record<string, number> = {
    seed: 25,
    sprout: 75,
    bloom: 150,
    patron: 500,
  };

  if (
    typeof pledge_amount !== 'number' ||
    pledge_amount < TIER_MINIMUMS[tier]
  ) {
    return NextResponse.json(
      {
        error: `Minimum pledge for '${tier}' tier is £${TIER_MINIMUMS[tier]}`,
      },
      { status: 400 }
    );
  }

  // ── Upsert ────────────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('founding_members')
    .upsert(
      {
        user_id: user.id,
        email: user.email,
        tier,
        pledge_amount,
        display_name: display_name ?? user.email,
        message: message ?? null,
        is_anonymous: is_anonymous ?? false,
        status: 'pledged',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ founding_member: data }, { status: 201 });
}

/** DELETE — withdraw a pending pledge */
export async function DELETE() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  // Only allow withdrawal if status is still 'pledged' (not yet processed)
  const { data: existing } = await supabase
    .from('founding_members')
    .select('status')
    .eq('user_id', user.id)
    .single();

  if (!existing) {
    return NextResponse.json(
      { error: 'No founding member pledge found' },
      { status: 404 }
    );
  }

  if (existing.status !== 'pledged') {
    return NextResponse.json(
      { error: 'Pledge cannot be withdrawn once confirmed or processed' },
      { status: 409 }
    );
  }

  const { error } = await supabase
    .from('founding_members')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
