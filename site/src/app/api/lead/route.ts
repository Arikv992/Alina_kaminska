import { NextResponse } from 'next/server';
import { createBrevoContact, type Lead } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Lead>;
    if (!body.name || !body.contact) return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    await createBrevoContact({ name: body.name, contact: body.contact, service: body.service || '', locale: body.locale || 'es' });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
