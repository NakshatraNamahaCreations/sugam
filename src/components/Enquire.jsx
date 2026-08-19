'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';
import SplitText from '@/components/SplitText';
import { APPLICATION_OPTIONS, CONTACT, LOAD_OPTIONS, TIMELINE_OPTIONS } from '@/data/site';

const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

const EMPTY = {
  name: '',
  org: '',
  designation: '',
  mobile: '',
  email: '',
  location: '',
  application: '',
  span: '',
  load: '',
  timeline: '',
  message: '',
  consent: false,
};

function validate(values) {
  const bad = {};
  if (!values.name.trim()) bad.name = true;
  if (!values.org.trim()) bad.org = true;
  if (!MOBILE_RE.test(values.mobile.trim())) bad.mobile = true;
  if (!EMAIL_RE.test(values.email.trim())) bad.email = true;
  if (!values.location.trim()) bad.location = true;
  if (!values.application) bad.application = true;
  return bad;
}

export default function Enquire() {
  const [values, setValues] = useState(EMPTY);
  const [bad, setBad] = useState({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);

  const field = (key) => ({
    id: `f-${key}`,
    name: key,
    value: values[key],
    onChange: (e) => {
      const { value } = e.target;
      setValues((v) => ({ ...v, [key]: value }));
      setBad((b) => (b[key] ? { ...b, [key]: false } : b));
    },
  });

  const cls = (key) => ['fld', bad[key] && 'bad'].filter(Boolean).join(' ');

  async function onSubmit(e) {
    e.preventDefault();
    const errors = validate(values);
    setBad(errors);

    if (Object.keys(errors).length || !values.consent) {
      const first = Object.keys(errors)[0];
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }

    setSending(true);
    setFailed(false);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
      /* GA4 / Google Ads conversion fires here. */
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="enquire" data-chapter="Enquire">
      <div className="wrap eq">
        <Reveal>
          <span className="eyebrow">Start a project</span>
          <SplitText as="h2" className="h1">Tell us about your crossing.</SplitText>
          <p className="lede" style={{ marginTop: 22 }}>
            Share the span, the load and the site condition. Our engineering team will revert with a
            profile recommendation and an indicative timeline.
          </p>
          <div className="contact">
            <div>
              <b>Call</b>
              <span className="stack">
                {CONTACT.phones.map((t) => (
                  <a key={t.href} href={t.href}>
                    {t.label}
                  </a>
                ))}
              </span>
            </div>
            <div>
              <b>Email</b>
              <span className="stack">
                {CONTACT.emails.map((t) => (
                  <a key={t.href} href={t.href}>
                    {t.label}
                  </a>
                ))}
              </span>
            </div>
            <div>
              <b>Web</b>
              <span className="stack">
                {CONTACT.sites.map((t) => (
                  <a key={t.href} href={t.href} target="_blank" rel="noreferrer">
                    {t.label}
                  </a>
                ))}
              </span>
            </div>
            <div>
              <b>{CONTACT.address.label}</b>
              <span className="stack">
                {CONTACT.address.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </div>
            <div>
              <b>Hours</b>
              <span>{CONTACT.hours}</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="form">
          <form onSubmit={onSubmit} noValidate>
            <div className="f2">
              <div className={cls('name')}>
                <label htmlFor="f-name">
                  Full name <em>*</em>
                </label>
                <input {...field('name')} />
                <span className="err">Enter your name</span>
              </div>
              <div className={cls('org')}>
                <label htmlFor="f-org">
                  Organisation <em>*</em>
                </label>
                <input {...field('org')} />
                <span className="err">Enter your organisation</span>
              </div>
            </div>

            <div className="f2">
              <div className="fld">
                <label htmlFor="f-designation">Designation</label>
                <input {...field('designation')} />
              </div>
              <div className={cls('mobile')}>
                <label htmlFor="f-mobile">
                  Mobile number <em>*</em>
                </label>
                <input {...field('mobile')} type="tel" inputMode="numeric" maxLength={10} placeholder="10 digits" />
                <span className="err">Enter a valid 10 digit mobile number</span>
              </div>
            </div>

            <div className="f2">
              <div className={cls('email')}>
                <label htmlFor="f-email">
                  Email <em>*</em>
                </label>
                <input {...field('email')} type="email" />
                <span className="err">Enter a valid email address</span>
              </div>
              <div className={cls('location')}>
                <label htmlFor="f-location">
                  Project location <em>*</em>
                </label>
                <input {...field('location')} placeholder="City, state" />
                <span className="err">Enter the project location</span>
              </div>
            </div>

            <div className={cls('application')}>
              <label htmlFor="f-application">
                Application type <em>*</em>
              </label>
              <select {...field('application')}>
                <option value="">Select an application</option>
                {APPLICATION_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <span className="err">Select an application type</span>
            </div>

            <div className="f2">
              <div className="fld">
                <label htmlFor="f-span">Approximate span (metres)</label>
                <input {...field('span')} type="number" min="1" max="60" />
              </div>
              <div className="fld">
                <label htmlFor="f-load">Expected live load</label>
                <select {...field('load')}>
                  <option value="">Select</option>
                  {LOAD_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fld">
              <label htmlFor="f-timeline">Project timeline</label>
              <select {...field('timeline')}>
                <option value="">Select</option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="fld">
              <label htmlFor="f-message">Message</label>
              <textarea
                {...field('message')}
                placeholder="Site condition, soil bearing capacity, tender reference, anything else useful"
              />
            </div>

            <label className="chk">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))}
                required
              />
              <span>I agree to be contacted regarding this enquiry.</span>
            </label>

            <button className="btn" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send enquiry'}
            </button>

            {failed && (
              <p className="err" style={{ display: 'block', marginTop: 12 }}>
                Could not send the enquiry. Please call us on {CONTACT.phones[0].label}.
              </p>
            )}
          </form>

          <div className={['done', done && 'on'].filter(Boolean).join(' ')}>
            <div>
              <div className="tick">&#10003;</div>
              <h3>Enquiry received</h3>
              <p>Our engineering team will respond within one working day.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
