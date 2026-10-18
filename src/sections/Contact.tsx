import { useState } from 'react'
import { contact } from '../data/content'
import { SectionShell } from '../components/SectionShell'
import { ResumeAction } from '../components/ResumeAction'
import { Reveal } from '../components/Reveal'
import { ArrowUpRightIcon, MailIcon } from '../components/icons'

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

const DELIVERY_CONFIGURED = false

/**
 * Contact section: two-column layout with professional links and an accessible
 * message form. Delivery is not configured, so the form never claims success.
 */
export function Contact() {
  const hasEmail = contact.email.trim().length > 0
  const links = contact.links.filter((link) => link.url.trim().length > 0)

  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM)
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormState, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const errors: Partial<Record<keyof ContactFormState, string>> = {}
  if (touched.name && form.name.trim().length === 0) errors.name = 'Name is required.'
  if (touched.email) {
    if (form.email.trim().length === 0) errors.email = 'Email is required.'
    else if (!isValidEmail(form.email.trim())) errors.email = 'Enter a valid email address.'
  }
  if (touched.subject && form.subject.trim().length === 0) errors.subject = 'Subject is required.'
  if (touched.message && form.message.trim().length === 0) errors.message = 'Message is required.'

  const canSubmit =
    form.name.trim().length > 0 &&
    form.subject.trim().length > 0 &&
    form.message.trim().length > 0 &&
    isValidEmail(form.email.trim())

  const markTouched = (field: keyof ContactFormState) =>
    setTouched((previous) => ({ ...previous, [field]: true }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    if (!canSubmit || !DELIVERY_CONFIGURED) return
    setStatus('submitting')
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
        <Reveal className="contact__info">
          <p className="contact__invite">
            Reach out for collaboration, internships, or full-time opportunities.
            I respond to thoughtful, specific messages.
          </p>

          {hasEmail ? (
            <a className="btn btn--primary contact__mail" href={`mailto:${contact.email}`}>
              <MailIcon size={15} />
              {contact.email}
            </a>
          ) : (
            <p className="contact__pending">
              <span className="tag tag--starter">Not configured</span>
              No email address is set yet. Add <code>contact.email</code> in{' '}
              <code>src/data/content.ts</code>.
            </p>
          )}

          {links.length > 0 && (
            <ul className="contact__links">
              {links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} rel="noopener noreferrer" target="_blank">
                    {link.label}
                    <ArrowUpRightIcon size={13} />
                  </a>
                </li>
              ))}
            </ul>
          )}

          <ResumeAction variant="ghost" />
        </Reveal>

        <Reveal delay={100} className="contact__form-wrap">
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="contact__field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => markTouched('name')}
                disabled={status === 'submitting'}
              />
              {errors.name && (
                <p id="contact-name-error" className="contact__field-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => markTouched('email')}
                disabled={status === 'submitting'}
              />
              {errors.email && (
                <p id="contact-email-error" className="contact__field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="contact__field contact__field--full">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                onBlur={() => markTouched('subject')}
                disabled={status === 'submitting'}
              />
              {errors.subject && (
                <p id="contact-subject-error" className="contact__field-error" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>

            <div className="contact__field contact__field--full">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                onBlur={() => markTouched('message')}
                disabled={status === 'submitting'}
              />
              {errors.message && (
                <p id="contact-message-error" className="contact__field-error" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="contact__form-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!canSubmit || !DELIVERY_CONFIGURED || status === 'submitting'}
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </div>

            <p className="contact__delivery-note" role="status">
              Message delivery is not configured yet. Use the email or profile links
              to reach me directly.
            </p>
          </form>
        </Reveal>
      </div>
    </SectionShell>
  )
}
