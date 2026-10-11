import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

/* ==========================================================
   SCAM SHIELD – App.jsx  (mobile-app style, multi-tab)
   Logo file:  public/logo.png   (shown ONLY on the splash screen)
   Flow: Splash (auto) -> App with 4 tabs: Home, Check, Learn, Help
   ========================================================== */

const APP_NAME = 'Scam Shield'
const LOGO_SRC = '/logo.png'
const SPLASH_MS = 3000 // how long the splash stays before moving on by itself

/* ---------- Icons ---------- */
function Icon({ name, size = 22 }) {
  const p = {
    shield: <><path d="M12 3 4.5 6v5.4c0 4.7 3.2 8.8 7.5 9.6 4.3-.8 7.5-4.9 7.5-9.6V6L12 3Z" /><path d="m8.7 12 2.1 2.1 4.5-4.7" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    home: <><path d="M3 11 12 3l9 8" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-6h4v6" /></>,
    scan: <><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" /></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5Z" /><path d="M19 18v3H6a2 2 0 0 1-2-2" /></>,
    help: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4M12 17.2v.1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    bank: <><path d="M3 10 12 4l9 6" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></>,
    rupee: <path d="M7 5h10M7 9h10M7 5c6 0 6 6 0 6h-.5l7 8" />,
    gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8C10 8 8 7 8 5s3-2 4 3c1-5 4-5 4-3s-2 3-4 3Z" /></>,
    box: <><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></>,
    brief: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>,
    badge: <><path d="M12 3 4.5 6v5.4c0 4.7 3.2 8.8 7.5 9.6 4.3-.8 7.5-4.9 7.5-9.6V6L12 3Z" /><path d="M12 9v4M12 15.8v.1" /></>,
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name]}
    </svg>
  )
}

/* ---------- Hooks / helpers ---------- */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCountUp(target, active, duration = 1500) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const k = Math.min((now - t0) / duration, 1)
      setV(Math.round(target * (1 - Math.pow(1 - k, 4))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return v
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms` }}>
      {children}
    </div>
  )
}

function Section({ kicker, title, children, action }) {
  return (
    <section className="block">
      <Reveal>
        <div className="block-head">
          <div>
            {kicker && <p className="kicker">{kicker}</p>}
            <h2>{title}</h2>
          </div>
          {action}
        </div>
      </Reveal>
      {children}
    </section>
  )
}

/* ==========================================================
   SPLASH – logo + name in ONE line, nothing else.
   Moves to the app automatically.
   ========================================================== */
function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), SPLASH_MS)
    const t2 = window.setTimeout(onDone, SPLASH_MS + 600)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [onDone])

  const dust = useMemo(() => Array.from({ length: 22 }, () => ({
    left: Math.random() * 100,
    size: 2 + Math.random() * 2.5,
    delay: -Math.random() * 14,
    dur: 10 + Math.random() * 10,
  })), [])

  return (
    <main className={`splash ${leaving ? 'splash-out' : ''}`}>
      <div className="splash-glow g1" /><div className="splash-glow g2" />
      <div className="dust" aria-hidden="true">
        {dust.map((d, i) => (
          <i key={i} style={{ left: `${d.left}%`, width: d.size, height: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
        ))}
      </div>

      <div className="lockup" role="img" aria-label={APP_NAME}>
        <div className="mark">
          <span className="mark-ring" />
          <span className="mark-pulse" />
          <div className="mark-tile">
            {logoOk
              ? <img src={LOGO_SRC} alt="" onError={() => setLogoOk(false)} />
              : <Icon name="shield" size={34} />}
          </div>
        </div>
        <h1 className="wordmark"><span>{APP_NAME}</span></h1>
      </div>

      <div className="splash-bar" aria-hidden="true"><i style={{ animationDuration: `${SPLASH_MS}ms` }} /></div>
    </main>
  )
}

/* ==========================================================
   DATA
   ========================================================== */
const SCAMS = [
  { id: 'kyc', icon: 'bank', title: 'Fake KYC / account blocked', sum: 'A message says your account will be frozen unless you update details now.',
    flags: ['Strong urgency: "today", "within 2 hours"', 'A link to "update KYC" or "verify account"', 'Asks for OTP, PIN, card or net-banking details'],
    todo: ['Do not click the link or call the number in the message', 'Open your bank\'s official app or visit the branch to check', 'Never share OTP or PIN, even with someone who says they are from the bank'] },
  { id: 'upi', icon: 'rupee', title: 'UPI collect request / refund trick', sum: 'You are told to approve a request or enter your PIN to "receive" money.',
    flags: ['You must enter your UPI PIN to get money', 'A "refund" or "cashback" you never expected', 'A buyer who sends a request instead of paying'],
    todo: ['Remember: you never need a PIN to receive money', 'Decline unknown collect requests', 'Check the amount and receiver name before approving anything'] },
  { id: 'lottery', icon: 'gift', title: 'Lottery and prize messages', sum: 'You "won" a big prize, but must pay a fee or tax first.',
    flags: ['A contest you never entered', 'Fees for "processing", "tax" or "delivery"', 'Pressure to reply or pay quickly'],
    todo: ['Ignore and delete the message', 'Real prizes never need an advance fee', 'Block the sender'] },
  { id: 'job', icon: 'brief', title: 'Job and task offers', sum: 'Easy online work that pays well, then asks you to deposit money first.',
    flags: ['Salary that sounds too good for simple tasks', 'Offers that arrive on WhatsApp or Telegram', 'Asks for a "deposit" or "registration" fee'],
    todo: ['Check the company on its official website', 'Never pay to get a job', 'Stop at the first request for money'] },
  { id: 'parcel', icon: 'box', title: 'Parcel and customs fee', sum: 'A small fee is requested to release a parcel you did not expect.',
    flags: ['You are not waiting for a parcel', 'A link on an unofficial-looking website', 'A small fee to hide a bigger trap'],
    todo: ['Track parcels only on the official courier app or site', 'Do not enter card details on a link from a message', 'Report the number as suspicious'] },
  { id: 'power', icon: 'bolt', title: 'Electricity disconnection', sum: 'Your power will be cut tonight unless you pay or call a number.',
    flags: ['Disconnection "tonight" with a personal number to call', 'Asks to install an app or pay to a personal UPI ID', 'Does not match your real bill'],
    todo: ['Check your bill on the official provider website or app', 'Do not call the number in the message', 'Pay only through official channels'] },
  { id: 'care', icon: 'headset', title: 'Fake customer care numbers', sum: 'A number found on a search result turns out to be a scammer.',
    flags: ['Asks you to install a remote-access app', 'Asks for OTP "to fix" an issue', 'Number is not on the company\'s own website'],
    todo: ['Get support numbers only from the official website or app', 'Never install screen-sharing apps for a stranger', 'End the call if they ask for any PIN or OTP'] },
  { id: 'invest', icon: 'trend', title: 'Investment and trading groups', sum: 'A group promises guaranteed profits and pushes you to invest quickly.',
    flags: ['"Guaranteed" or very high returns', 'Added to a group you did not join', 'Pressure to add more money for "bigger profits"'],
    todo: ['Use only registered, well-known platforms', 'Ignore tips from unknown groups', 'Do not transfer money to personal accounts'] },
  { id: 'police', icon: 'badge', title: '"Digital arrest" and police impersonation', sum: 'Callers pretend to be police or officials and say you are under arrest.',
    flags: ['A video or voice call claiming you are being "arrested"', 'Demands money to "settle" a case', 'Tells you to keep it secret from family'],
    todo: ['Hang up. Real agencies do not arrest people over video calls', 'Talk to a family member or friend straight away', 'Report the call on 1930'] },
]

const TIPS = [
  ['Never share your OTP', 'Banks and officials will never ask for your OTP, UPI PIN, CVV or password.'],
  ['Urgent? Slow down', 'Scammers create panic. A real problem will still be there after a calm check.'],
  ['Check the link', 'Do not tap links in unexpected messages. Open the official app or website yourself.'],
  ['No PIN to receive money', 'You only enter a UPI PIN to send money, never to receive it.'],
  ['Avoid remote apps', 'Do not install screen-sharing apps because a caller asked you to.'],
  ['Talk to someone', 'Tell a family member or friend before you pay when something feels off.'],
]

const RULES = [
  'Never share OTP, PIN, CVV or passwords with anyone.',
  'Do not click links in messages you did not expect.',
  'Verify using official apps and websites only.',
  'Be careful when you feel rushed or scared.',
  'Report fraud quickly on 1930.',
]

const SAMPLES = [
  ['Fake KYC', 'Dear customer, your bank account will be blocked today. Update your KYC immediately: http://bit.ly/kyc-update'],
  ['Lottery', 'Congratulations! You won ₹25,00,000 in the lucky draw. Pay ₹4,999 processing fee to claim your prize.'],
  ['Parcel fee', 'Your parcel is held at customs. Pay a small delivery fee here: http://india-post-track.xyz'],
  ['UPI refund', 'Please approve the UPI collect request to receive your refund of ₹2,000.'],
]

const AFTER_STEPS = [
  ['Call 1930 right away', 'The national cyber fraud helpline. Faster reporting gives a better chance of action.'],
  ['Tell your bank', 'Call your bank\'s official number and ask them to block cards, UPI or net banking.'],
  ['Report online', 'File a complaint on the national cybercrime portal with all details.'],
  ['Stop contact', 'Do not reply, pay again or share more details with the scammer.'],
  ['Change passwords', 'Update banking, email and UPI passwords from a safe device.'],
  ['Warn family', 'Tell people close to you so they do not receive the same trick.'],
]

const EVIDENCE = [
  'Screenshots of messages, chats and numbers',
  'Transaction ID, date and amount',
  'Phone numbers, UPI IDs or bank accounts used',
  'Links or website names you were sent',
  'Call time and what was said',
]

const FAQ = [
  ['Is it safe to paste a message here?', 'Paste only the message text. Never paste OTPs, PINs, passwords, card numbers or other private bank details.'],
  ['Can Scam Shield prove a message is a scam?', 'No. It shows which reviewed warning rules match. A low result does not guarantee that a message is safe, so always verify through official channels.'],
  ['I already clicked a link. What now?', 'Do not enter any details. If you did, call your bank and 1930 right away, then change your passwords.'],
  ['Will I get my money back?', 'There is no guarantee, but reporting quickly gives the best chance. Call 1930 as soon as you notice.'],
  ['Who should I contact?', 'Call 1930 for cyber fraud, contact your bank about your accounts, and use the official cybercrime portal for a complaint.'],
]

/* ==========================================================
   SMALL SHARED PARTS
   ========================================================== */
function Acc({ open, onToggle, icon, title, sub, id, children }) {
  return (
    <div className={`acc ${open ? 'open' : ''}`} id={id}>
      <button className="acc-head" onClick={onToggle} aria-expanded={open}>
        {icon && <span className="acc-icon"><Icon name={icon} size={20} /></span>}
        <span className="acc-title"><b>{title}</b>{sub && <small>{sub}</small>}</span>
        <Icon name="chevron" size={20} />
      </button>
      <div className="acc-body"><div>{children}</div></div>
    </div>
  )
}

function Gauge({ score, tone }) {
  const v = useCountUp(Number(score) || 0, true, 1300)
  const C = 2 * Math.PI * 54
  return (
    <div className={`gauge ${tone}`} role="img" aria-label={`Score ${score} out of 100`}>
      <svg viewBox="0 0 120 120">
        <circle className="g-track" cx="60" cy="60" r="54" />
        <circle className="g-fill" cx="60" cy="60" r="54" strokeDasharray={C} strokeDashoffset={C * (1 - v / 100)} />
      </svg>
      <div><strong>{v}</strong><small>/100</small></div>
    </div>
  )
}

function Stat({ end, suffix = '', label, active }) {
  const v = useCountUp(end, active, 1700)
  return <div className="stat"><strong>{v}{suffix}</strong><span>{label}</span></div>
}

function TipCarousel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % TIPS.length), 4200)
    return () => clearInterval(t)
  }, [i])
  return (
    <div className="carousel">
      <div className="car-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {TIPS.map(([t, d], n) => (
          <article className="tip" key={t} aria-hidden={n !== i}>
            <span className="tip-no">{String(n + 1).padStart(2, '0')}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <div className="dots">
        {TIPS.map(([t], n) => (
          <button key={t} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Show tip ${n + 1}`} />
        ))}
      </div>
    </div>
  )
}

function CommunitySearch() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function search(e) {
    e.preventDefault()
    if (!value.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/community/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      setResult(await res.json())
    } catch {
      // Ignore errors for clean UI
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="scanner" style={{ marginTop: '60px' }} id="search">
      <div className="scanner-inner">
        <p className="eyebrow">COMMUNITY DATABASE</p>
        <h2>Search a Number or UPI</h2>
        <p className="sub">Check if a phone number or UPI ID has been reported by others.</p>

        <form onSubmit={search} style={{ marginTop: '24px' }}>
          <div className="field">
            <input
              type="text"
              className="custom-input"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter Phone Number or UPI ID..."
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Searching...' : 'Search Database'}
            </button>
          </div>
        </form>

        {result && (
          <div className={`result ${result.reportCount > 0 ? 'high' : 'low'}`}>
            <div className="result-top">
              <div>
                <p className="mini-label">DATABASE RESULT</p>
                <h3>{result.reportCount > 0 ? `${result.reportCount} Reports Found` : 'No Reports Found'}</h3>
              </div>
            </div>
            {result.reportCount > 0 ? (
              <ul>
                {result.reasons.map((r, i) => (
                  <li key={i}><div className="tick">!</div><p>{r}</p></li>
                ))}
              </ul>
            ) : (
              <p className="result-note">This number/UPI is not in our reported database. Still proceed with caution.</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function SubmitReport() {
  const [type, setType] = useState('PHONE')
  const [value, setValue] = useState('')
  const [reason, setReason] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!value.trim() || !reason.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/community/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, reason }),
      })
      const data = await res.json()
      setMsg(data.message)
      setValue('')
      setReason('')
    } catch {
      // Ignore errors for clean UI
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="scanner" style={{ marginTop: '40px', marginBottom: '80px' }} id="report">
      <div className="scanner-inner">
        <p className="eyebrow">HELP OTHERS</p>
        <h2>Report a Scammer</h2>
        <p className="sub">Submit a suspicious number or UPI ID to protect the community.</p>

        <form onSubmit={submit} style={{ marginTop: '24px' }}>
          <div className="field" style={{ marginBottom: '16px' }}>
            <select className="custom-input" value={type} onChange={e => setType(e.target.value)}>
              <option value="PHONE">Phone Number</option>
              <option value="UPI">UPI ID</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: '16px' }}>
            <input type="text" className="custom-input" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter Number or UPI ID" />
          </div>
          <div className="field">
            <textarea rows="3" value={reason} onChange={e => setReason(e.target.value)} placeholder="What did they do?" style={{ minHeight: '80px' }} />
          </div>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
        {msg && <div className="form-error" style={{ color: '#03130c', background: 'var(--mint)', borderColor: 'var(--mint)' }}>{msg}</div>}
      </div>
    </section>
  )
}

/* ==========================================================
   TAB 1 – HOME
   ========================================================== */
function HomeTab({ go, openScam }) {
  const [statRef, statIn] = useInView(0.3)
  const [stepsRef, stepsIn] = useInView(0.2)

  return (
    <>
      <section className="hero-card">
        <div className="hero-shield">
          <i /><i /><i />
          <div><Icon name="shield" size={34} /></div>
        </div>
        <p className="kicker">Ready to help</p>
        <h1>Pause. Check. <span className="grad-text">Then act.</span></h1>
        <p className="hero-text">Paste any suspicious SMS, WhatsApp message or email and see which scam warning signs match it.</p>
        <button className="btn btn-primary btn-block" onClick={() => go('check')}>
          Check a message <Icon name="arrow" size={19} />
        </button>
      </section>

      <div className="alert-strip" role="note">
        <span><Icon name="alert" size={18} /></span>
        <div className="alert-marquee"><p>Never share your OTP, UPI PIN, CVV or password with anyone, not even bank staff. &nbsp;•&nbsp; Never share your OTP, UPI PIN, CVV or password with anyone, not even bank staff. &nbsp;•&nbsp;</p></div>
      </div>

      <Section kicker="Quick actions" title="What do you need?">
        <div className="quick">
          {[
            ['scan', 'Check message', 'Scan for warning signs', () => go('check')],
            ['book', 'Learn scams', '9 common patterns', () => go('learn')],
            ['help', 'After a scam', 'Steps to take now', () => go('help')],
          ].map(([ic, t, s, fn], i) => (
            <Reveal key={t} delay={i * 90}>
              <button className="quick-card" onClick={fn}>
                <span className="q-icon"><Icon name={ic} size={22} /></span>
                <b>{t}</b><small>{s}</small>
              </button>
            </Reveal>
          ))}
          <Reveal delay={270}>
            <a className="quick-card call" href="tel:1930">
              <span className="q-icon"><Icon name="phone" size={22} /></span>
              <b>Call 1930</b><small>Cyber fraud helpline</small>
            </a>
          </Reveal>
        </div>
      </Section>

      <Section kicker="Daily safety" title="Tips that protect you">
        <Reveal><TipCarousel /></Reveal>
      </Section>

      <section className="stats" ref={statRef}>
        <Stat end={1930} label="Helpline number" active={statIn} />
        <Stat end={24} suffix="/7" label="Reporting open" active={statIn} />
        <Stat end={SCAMS.length} label="Scam types covered" active={statIn} />
      </section>

      <Section kicker="How it works" title="Three calm steps">
        <div className={`timeline ${stepsIn ? 'in' : ''}`} ref={stepsRef}>
          <div className="tl-line" aria-hidden="true" />
          {[
            ['Paste the message', 'Copy the suspicious SMS, chat or email into the checker.'],
            ['Read the evidence', 'See the warning rules that matched and open their sources.'],
            ['Verify or report', 'Use official channels if your money or data may be at risk.'],
          ].map(([t, d], i) => (
            <article key={t} style={{ '--i': i }}>
              <span className="tl-no">{i + 1}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </article>
          ))}
        </div>
      </Section>

      <Section kicker="Know the patterns" title="Common scams"
        action={<button className="text-btn" onClick={() => go('learn')}>See all</button>}>
        <div className="list">
          {SCAMS.slice(0, 4).map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <button className="row-card" onClick={() => openScam(s.id)}>
                <span className="row-icon"><Icon name={s.icon} size={21} /></span>
                <span className="row-text"><b>{s.title}</b><small>{s.sum}</small></span>
                <Icon name="arrow" size={18} />
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section kicker="Remember" title="5 golden rules">
        <div className="rules">
          {RULES.map((r, i) => (
            <Reveal key={r} delay={i * 70}>
              <div className="rule"><span>{i + 1}</span><p>{r}</p></div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CommunitySearch />

      <Reveal>
        <SubmitReport />
      </Reveal>

      <Reveal>
        <section className="cta-card">
          <div className="cta-spin" aria-hidden="true" />
          <div className="cta-in">
            <h2>A quick check can prevent a costly mistake.</h2>
            <button className="btn btn-light btn-block" onClick={() => go('check')}>Check a message <Icon name="arrow" size={19} /></button>
          </div>
        </section>
      </Reveal>

      <p className="fine"><Icon name="lock" size={15} /> Never paste OTPs, PINs, passwords or bank details into this app.</p>
    </>
  )
}

/* ==========================================================
   TAB 2 – CHECK (talks to Spring Boot)
   ========================================================== */
function CheckTab() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function scan(e) {
    e.preventDefault()
    setError(''); setResult(null)
    if (!message.trim()) { setError('Paste a suspicious message first.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/scan/message', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }),
      })
      if (!res.ok) throw new Error()
      setResult(await res.json())
    } catch {
      setError('Could not reach the scanner. Check that Spring Boot is running.')
    } finally { setLoading(false) }
  }

  const level = (result?.level || '').toLowerCase()
  const tone = level === 'critical' || level === 'high' ? 'high' : level === 'medium' ? 'medium' : 'low'

  return (
    <>
      <section className="page-head">
        <p className="kicker">Message checker</p>
        <h1>Check the <span className="grad-text">warning signs.</span></h1>
        <p>Paste a suspicious SMS, WhatsApp message or email below.</p>
      </section>

      <section className="card">
        <p className="mini">Try a sample</p>
        <div className="chips">
          {SAMPLES.map(([label, text]) => (
            <button key={label} type="button" className="chip" onClick={() => { setMessage(text); setResult(null); setError('') }}>{label}</button>
          ))}
        </div>

        <form onSubmit={scan}>
          <label htmlFor="message">Suspicious message</label>
          <div className={`field ${loading ? 'scanning' : ''}`}>
            <textarea id="message" rows="6" value={message} maxLength={2000}
              onChange={(e) => setMessage(e.target.value)} placeholder="Paste the message here..." />
            <i className="laser" aria-hidden="true" />
          </div>
          <div className="field-foot">
            <span>{message.length}/2000</span>
            {message && <button type="button" className="text-btn" onClick={() => { setMessage(''); setResult(null); setError('') }}>Clear</button>}
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <><span className="spinner" /> Checking...</> : <><Icon name="scan" size={19} /> Check message</>}
          </button>
        </form>

        {error && <p className="error" role="alert"><Icon name="alert" size={18} /> {error}</p>}

        {result && (
          <section className={`result ${tone}`} aria-live="polite">
            <div className="result-top">
              <Gauge score={result.score} tone={tone} />
              <div><span className="mini">Warning level</span><h3>{result.level}</h3></div>
            </div>
            <h4>What was found</h4>
            <ul>
              {(result.matches || []).map((m, i) => (
                <li key={i} style={{ '--i': i }}>
                  <span className="tick"><Icon name="check" size={14} /></span>
                  <div>
                    <p>{m.explanation}</p>
                    {m.sourceUrl && <a href={m.sourceUrl} target="_blank" rel="noreferrer">View official source <Icon name="link" size={14} /></a>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="note">This gives guidance from matched rules. It does not prove that a message is safe or fraudulent.</p>
          </section>
        )}
      </section>

      <section className="info-card warn">
        <span><Icon name="phone" size={21} /></span>
        <div><b>Lost money to a scam?</b><p>Call the cybercrime helpline <a href="tel:1930">1930</a> immediately.</p></div>
      </section>
      <p className="fine"><Icon name="lock" size={15} /> Never paste OTPs, PINs, passwords or bank details here.</p>
    </>
  )
}

/* ==========================================================
   TAB 3 – LEARN
   ========================================================== */
function LearnTab({ openId, setOpenId }) {
  const [q, setQ] = useState('')
  const list = SCAMS.filter((s) => (s.title + s.sum).toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    if (!openId) return
    const t = setTimeout(() => document.getElementById(`scam-${openId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350)
    return () => clearTimeout(t)
  }, [openId])

  return (
    <>
      <section className="page-head">
        <p className="kicker">Learn</p>
        <h1>Scams that keep <span className="grad-text">coming back.</span></h1>
        <p>Tap a scam to see the red flags and what to do instead.</p>
      </section>

      <label className="search">
        <Icon name="search" size={19} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scams (e.g. UPI, parcel)" aria-label="Search scams" />
      </label>

      <div className="acc-list">
        {list.map((s, i) => (
          <Reveal key={s.id} delay={Math.min(i, 4) * 60}>
            <Acc id={`scam-${s.id}`} icon={s.icon} title={s.title} sub={s.sum}
              open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? null : s.id)}>
              <h4 className="sub-red"><Icon name="alert" size={16} /> Red flags</h4>
              <ul className="dots-list red">{s.flags.map((f) => <li key={f}>{f}</li>)}</ul>
              <h4 className="sub-green"><Icon name="shield" size={16} /> What to do</h4>
              <ul className="dots-list green">{s.todo.map((f) => <li key={f}>{f}</li>)}</ul>
            </Acc>
          </Reveal>
        ))}
        {list.length === 0 && <p className="empty">No scam found for "{q}". Try another word.</p>}
      </div>

      <section className="info-card">
        <span><Icon name="spark" size={21} /></span>
        <div><b>Not sure about a message?</b><p>Use the Check tab to see which warning signs match.</p></div>
      </section>
    </>
  )
}

/* ==========================================================
   TAB 4 – HELP
   ========================================================== */
function HelpTab() {
  const [done, setDone] = useState(() => EVIDENCE.map(() => false))
  const [faq, setFaq] = useState(0)
  const count = done.filter(Boolean).length

  return (
    <>
      <section className="page-head">
        <p className="kicker">Help</p>
        <h1>Lost money? <span className="grad-text">Act fast.</span></h1>
        <p>The first hours matter. Follow these steps.</p>
      </section>

      <a className="sos" href="tel:1930">
        <span className="sos-ring"><i /><i /><Icon name="phone" size={28} /></span>
        <span><small>National cyber fraud helpline</small><b>Call 1930</b></span>
        <Icon name="arrow" size={22} />
      </a>

      <Section kicker="Step by step" title="What to do right now">
        <div className="steps">
          {AFTER_STEPS.map(([t, d], i) => (
            <Reveal key={t} delay={(i % 3) * 70}>
              <article className="step"><span>{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section kicker="Official channels" title="Report online">
        <div className="links">
          <Reveal>
            <a className="link-card" href="https://www.cybercrime.gov.in/" target="_blank" rel="noreferrer">
              <span><Icon name="badge" size={22} /></span>
              <div><b>National Cybercrime Portal</b><small>cybercrime.gov.in · file a complaint</small></div>
              <Icon name="link" size={18} />
            </a>
          </Reveal>
          <Reveal delay={90}>
            <a className="link-card" href="https://sancharsaathi.gov.in/" target="_blank" rel="noreferrer">
              <span><Icon name="phone" size={22} /></span>
              <div><b>Sanchar Saathi</b><small>sancharsaathi.gov.in · report suspicious calls and messages</small></div>
              <Icon name="link" size={18} />
            </a>
          </Reveal>
        </div>
      </Section>

      <Section kicker="Keep proof" title="Collect evidence">
        <Reveal>
          <div className="card">
            <div className="prog"><i style={{ width: `${(count / EVIDENCE.length) * 100}%` }} /></div>
            <p className="prog-text">{count} of {EVIDENCE.length} ready</p>
            {EVIDENCE.map((e, i) => (
              <button key={e} className={`check-row ${done[i] ? 'on' : ''}`}
                onClick={() => setDone((d) => d.map((v, n) => (n === i ? !v : v)))} aria-pressed={done[i]}>
                <span><Icon name="check" size={14} /></span>{e}
              </button>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section kicker="Questions" title="Quick answers">
        <div className="acc-list">
          {FAQ.map(([q, a], i) => (
            <Acc key={q} title={q} open={faq === i} onToggle={() => setFaq(faq === i ? -1 : i)}>
              <p className="faq-a">{a}</p>
            </Acc>
          ))}
        </div>
      </Section>

      <p className="fine"><Icon name="lock" size={15} /> This app gives guidance only. It is not legal or police advice.</p>
    </>
  )
}

/* ==========================================================
   APP SHELL (header + tabs + bottom navigation)
   ========================================================== */
const TABS = [['home', 'Home', 'home'], ['check', 'Check', 'scan'], ['learn', 'Learn', 'book'], ['help', 'Help', 'help']]

function AppShell() {
  const [tab, setTab] = useState('home')
  const [openId, setOpenId] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  function go(next) {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function openScam(id) {
    setOpenId(id)
    go('learn')
  }

  const index = TABS.findIndex(([k]) => k === tab)

  return (
    <div className="stage">
      <div className="bg-decor" aria-hidden="true"><i className="b1" /><i className="b2" /></div>
      <div className="device">
        <header className={`app-bar ${scrolled ? 'scrolled' : ''}`}>
          <div>
            <p className="status"><span /> Ready</p>
            <p className="app-name">{APP_NAME}</p>
          </div>
          <a className="sos-mini" href="tel:1930" aria-label="Call cyber fraud helpline 1930"><Icon name="phone" size={17} /> 1930</a>
        </header>

     <main className="screen" key={tab}>
          {tab === 'home' && <HomeTab go={go} openScam={openScam} />}
          {tab === 'check' && <CheckTab />}
          {tab === 'learn' && <LearnTab openId={openId} setOpenId={setOpenId} />}
          {tab === 'help' && <HelpTab />}
        </main>
      </div>

      <nav className="tabbar" aria-label="Main navigation" style={{ '--n': index }}>
        <i className="tab-pill" aria-hidden="true" />
        {TABS.map(([k, label, ic]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => go(k)} aria-current={tab === k ? 'page' : undefined}>
            <Icon name={ic} size={22} /><span>{label}</span>
          </button>
        ))}
        </nav>
      </div>
   
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  // useCallback-free stable handler so the splash timer is never reset
  const done = useRef(() => setReady(true)).current
  return ready ? <AppShell /> : <Splash onDone={done} />
}
