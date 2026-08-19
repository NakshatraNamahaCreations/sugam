import { NextResponse } from 'next/server';

const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const REQUIRED = ['name', 'org', 'location', 'application'];

/* Receives the enquiry form. Validation is repeated here because the client
   side checks are only a convenience. Wire the delivery step (mail, CRM or
   sheet) where marked. */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  const missing = REQUIRED.filter((k) => !String(body?.[k] ?? '').trim());
  if (missing.length) {
    return NextResponse.json({ ok: false, error: `Missing: ${missing.join(', ')}` }, { status: 400 });
  }
  if (!MOBILE_RE.test(String(body.mobile ?? '').trim())) {
    return NextResponse.json({ ok: false, error: 'Invalid mobile number' }, { status: 400 });
  }
  if (!EMAIL_RE.test(String(body.email ?? '').trim())) {
    return NextResponse.json({ ok: false, error: 'Invalid email address' }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ ok: false, error: 'Consent is required' }, { status: 400 });
  }

  /* TODO: deliver the enquiry — nodemailer, CRM webhook or a sheet append. */
  console.log('[enquiry]', {
    name: body.name,
    org: body.org,
    mobile: body.mobile,
    email: body.email,
    location: body.location,
    application: body.application,
  });

  return NextResponse.json({ ok: true });
}
