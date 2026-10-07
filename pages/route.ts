/**
 * Mock RFQ intake endpoint for Runash Sons of Industries.
 * Path in your project: app/api/rfq/route.ts
 *
 * This currently just validates the payload and logs it — no database
 * or email is wired up. Swap the TODO block for your real persistence
 * (Postgres insert, CRM webhook, RunAsh agentic intake pipeline, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';

interface RFQPayload {
  name: string;
  email: string;
  component: string;
  details?: string;
}

// In-memory store so the mock route is demonstrable without a DB.
// Resets on every server restart — replace with real storage.
const mockSubmissions: (RFQPayload & { id: string; receivedAt: string })[] = [];

export async function POST(req: NextRequest) {
  let body: Partial<RFQPayload>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, component, details } = body;

  if (!name || !email || !component) {
    return NextResponse.json(
      { error: 'name, email, and component are required' },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const submission = {
    id: crypto.randomUUID(),
    name,
    email,
    component,
    details: details ?? '',
    receivedAt: new Date().toISOString(),
  };

  // TODO: replace with real persistence — e.g.
  //   await db.insert(rfqTable).values(submission)
  // or forward into the RunAsh agentic intake pipeline.
  mockSubmissions.push(submission);
  console.log('[RFQ] New submission:', submission);

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}

// Handy for local testing: GET returns everything captured this session.
export async function GET() {
  return NextResponse.json({ count: mockSubmissions.length, submissions: mockSubmissions });
}
