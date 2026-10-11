import { useState } from 'react'
import { contact } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { ResumeAction } from '../components/ResumeAction'
import { Reveal } from '../components/Reveal'
import { ArrowUpRightIcon, MailIcon } from '../components/icons'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

interface ContactFormState {
  name: string
  email: string
  subject: string
  message: string
}

const EMPTY_FORM: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

/**
 * Contact form wired to /api/v1/contact. No success is shown on backend/provider
 * failure; validation, loading state, and duplicate-submit prevention included.
 */
export function Contact() {
  const hasEmail = contact.email.trim().length > 0
  const links = contact.links.filter((link) => link.url.trim().length > 0)

  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const canSubmit =
    form.name.trim().length > 0 &&
    form.subject.trim().length > 0 &&
    form.message.trim().length > 0 &&
    isValidEmail(form.email.trim()) &&
    status !== 'submitting'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    setStatus('submitting')
    setError('')
    setSuccessMsg('')
    try {
      const response = await fetch(`${API_BASE}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      })
      if (response.ok) {
        setStatus('success')
        setSuccessMsg('Message sent. I’ll get back to you soon.')
        setForm(EMPTY_FORM)
      } else {
        let message = 'Could not send message.'
        try {
          const data = await response.json()
          message = data.error?.message ?? data.detail ?? message
        } catch {
          // ignore
        }
        setStatus('error')
        setError(message)
      }
    } catch {
      setStatus('error')
      setError('Could not reach the portfolio API. Check that the backend is running.')
    }
  }

  return (
    <SectionShell
      id="contact"
      index="06"
      kicker="Contact"
      title="Let's build something useful."
      lede="If you have a hard problem worth solving, or an opportunity in AI engineering and software, I'd like to hear about it."
    >
      <div className="contact__grid">
        <Reveal className="contact__primary">
          {hasEmail ? (
            <a className="btn btn--primary contact__mail" href={`mailto:${contact.email}`}>
              <MailIcon size={15} />
              {contact.email}
            </a>
          ) : (
            <p className="contact__pending">
              <span className="tag tag--starter">Not configured</span>
              No email address is set yet. Add <code>contact.email</code> in{' '}
              <code>src/data/content.ts</code> and this button goes live — the
              portfolio never shows a channel that cannot reach me.
            </p>
          )}
          <ResumeAction variant="ghost" />
        </Reveal>

        <Reveal delay={100} className="contact__channels">
          {links.length > 0 ? (
            <ul>
              {links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} rel="noopener noreferrer" target="_blank">
                    {link.label}
                    <ArrowUpRightIcon size={13} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="contact__pending">
              <span className="tag tag--starter">Not configured</span>
              GitHub, LinkedIn and other profiles can be listed here — add them
              to <code>contact.links</code>.
            </p>
          )}
        </Reveal>
      </div>

        <Reveal delay={160} className="contact__note">
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="contact__field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                minLength={1}
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={status === 'submitting'}
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={status === 'submitting'}
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                minLength={1}
                maxLength={150}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                disabled={status === 'submitting'}
              />
            </div>
            <div className="contact__field contact__field--full">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                minLength={1}
                maxLength={2000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                disabled={status === 'submitting'}
              />
            </div>
            <div className="contact__form-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!canSubmit}
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </div>
            {status === 'error' && error && (
              <p className="contact__form-feedback contact__form-feedback--error" role="alert">
                {error}
              </p>
            )}
            {status === 'success' && successMsg && (
              <p className="contact__form-feedback contact__form-feedback--success" role="status" aria-live="polite">
                {successMsg}
              </p>
            )}
          </form>
        </Reveal>
    </SectionShell>
  )
}
