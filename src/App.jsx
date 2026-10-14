// App.jsx
import { useEffect, useRef, useState } from 'react'
import './App.css'

const APP_NAME = 'Scam Shield'
const LOGO_SRC = '/logo.png'
const SPLASH_MS = 3000
const MAX_FILE_BYTES = 10 * 1024 * 1024
const DOCUMENT_EXTENSIONS = /\.(pdf|doc|docx|docm|xls|xlsx|xlsm|ppt|pptx|pptm)$/i
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap'

// Existing Spring Boot endpoints are preserved.
// Actual backend behavior and response contracts require integration testing.
// Scan responses must contain { level: "LOW" | "MEDIUM" | "HIGH", score: number }.
// Optional findings: [{ reason, points, sourceUrl, sourceName }].

function Icon({ name, size = 22 }) {
  const paths = {
    shield: (
      <>
        <path d="M12 3 4.5 6v5.4c0 4.7 3.2 8.8 7.5 9.6 4.3-.8 7.5-4.9 7.5-9.6V6L12 3Z" />
        <path d="m8.7 12 2.1 2.1 4.5-4.7" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    home: (
      <>
        <path d="M3 11 12 3l9 8M5 9.5V20h14V9.5" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
    scan: (
      <>
        <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
        <path d="M7 12h10" />
      </>
    ),
    book: (
      <>
        <path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5Z" />
        <path d="M19 18v3H6a2 2 0 0 1-2-2" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
      </>
    ),
    phone: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    ),
    alert: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 10v4M12 17.2v.1" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    bank: <path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
    rupee: <path d="M7 5h10M7 9h10M7 5c6 0 6 6 0 6h-.5l7 8" />,
    gift: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M5 12v8h14v-8M12 8v12M12 8C10 8 8 7 8 5s3-2 4 3c1-5 4-5 4-3s-2 3-4 3Z" />
      </>
    ),
    box: (
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5 12 12l9-4.5M12 12v9" />
    ),
    brief: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
      </>
    ),
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
    headset: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
      </>
    ),
    badge: (
      <>
        <path d="M12 3 4.5 6v5.4c0 4.7 3.2 8.8 7.5 9.6 4.3-.8 7.5-4.9 7.5-9.6V6L12 3Z" />
        <path d="M12 9v4M12 15.8v.1" />
      </>
    ),
    spark: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m12 7.5 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
    pause: <path d="M9 5v14M15 5v14" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    camera: (
      <>
        <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    chat: (
      <>
        <path d="M4 5h16v11H9l-5 4V5Z" />
        <path d="M8 9.5h8M8 12.5h5" />
      </>
    ),
  }
  

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.shield}
    </svg>
  )
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

function useCountUp(target, active, duration = 1500) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    let frame
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 4))))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration])

  return value
}

function useRequest() {
  const controller = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(
    () => () => {
      controller.current?.abort()
      controller.current = null
    },
    [],
  )

  function cancel() {
    controller.current?.abort()
    controller.current = null
    setLoading(false)
  }

  async function request(url, options = {}) {
    controller.current?.abort()

    const current = new AbortController()
    controller.current = current
    setLoading(true)

    const timeout = window.setTimeout(() => current.abort(), 60000)

    try {
      const response = await fetch(url, {
        ...options,
        signal: current.signal,
      })

      const data = await response.json().catch(() => null)

      if (current !== controller.current) return null

      if (!response.ok) {
        throw new Error(
          `Request failed (${response.status}). Please try again.`,
        )
      }

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('The server returned an invalid response.')
      }

      return data
    } catch (error) {
      if (current !== controller.current) return null

      if (error.name === 'AbortError') {
        throw new Error('The request timed out. Please try again.')
      }

      throw error
    } finally {
      window.clearTimeout(timeout)

      if (current === controller.current) {
        controller.current = null
        setLoading(false)
      }
    }
  }

  return { request, cancel, loading }
}

function validateScan(data) {
  const level =
    typeof data.level === 'string' ? data.level.trim().toLowerCase() : ''

  if (
    !['low', 'medium', 'high'].includes(level) ||
    typeof data.score !== 'number' ||
    !Number.isFinite(data.score) ||
    data.score < 0 ||
    data.score > 100
  ) {
    throw new Error('The server returned an invalid scan result.')
  }

  return {
    ...data,
    level,
    findings: Array.isArray(data.findings) ? data.findings : [],
  }
}

function safeSource(value) {
  if (typeof value !== 'string') return null

  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` }}
    >
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

function ErrorMessage({ children }) {
  if (!children) return null

  return (
    <p className="error" role="alert">
      <Icon name="alert" size={18} />
      <span>{children}</span>
    </p>
  )
}

function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), SPLASH_MS)
    const doneTimer = window.setTimeout(onDone, SPLASH_MS + 600)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <main className={`splash ${leaving ? 'splash-out' : ''}`}>
      <div className="lockup" role="img" aria-label={APP_NAME}>
        <div className="mark">
          <span className="mark-ring" />
          <span className="mark-pulse" />
          <div className="mark-tile">
            {logoOk ? (
              <img src={LOGO_SRC} alt="" onError={() => setLogoOk(false)} />
            ) : (
              <Icon name="shield" size={34} />
            )}
          </div>
        </div>
        <h1 className="wordmark">
          <span>{APP_NAME}</span>
        </h1>
      </div>

      <div className="splash-bar" aria-hidden="true">
        <i style={{ animationDuration: `${SPLASH_MS}ms` }} />
      </div>
    </main>
  )
}

const SCAMS = [
  {
    id: 'kyc',
    icon: 'bank',
    title: 'Fake KYC / account blocked',
    sum: 'A message says your account will be frozen unless you update details now.',
    flags: [
      'Strong urgency: "today", "within 2 hours"',
      'A link to "update KYC" or "verify account"',
      'Asks for OTP, PIN, card or net-banking details',
    ],
    todo: [
      'Do not click the link or call the number in the message',
      "Open your bank's official app or visit the branch to check",
      'Never share OTP or PIN, even with someone who says they are from the bank',
    ],
  },
  {
    id: 'upi',
    icon: 'rupee',
    title: 'UPI collect request / refund trick',
    sum: 'You are told to approve a request or enter your PIN to "receive" money.',
    flags: [
      'You must enter your UPI PIN to get money',
      'A "refund" or "cashback" you never expected',
      'A buyer who sends a request instead of paying',
    ],
    todo: [
      'Remember: you never need a PIN to receive money',
      'Decline unknown collect requests',
      'Check the amount and receiver name before approving anything',
    ],
  },
  {
    id: 'lottery',
    icon: 'gift',
    title: 'Lottery and prize messages',
    sum: 'You "won" a big prize, but must pay a fee or tax first.',
    flags: [
      'A contest you never entered',
      'Fees for "processing", "tax" or "delivery"',
      'Pressure to reply or pay quickly',
    ],
    todo: [
      'Ignore and delete the message',
      'Do not pay advance fees to claim an unexpected prize',
      'Block the sender',
    ],
  },
  {
    id: 'job',
    icon: 'brief',
    title: 'Job and task offers',
    sum: 'Easy online work that pays well, then asks you to deposit money first.',
    flags: [
      'Salary that sounds too good for simple tasks',
      'Offers that arrive on WhatsApp or Telegram',
      'Asks for a "deposit" or "registration" fee',
    ],
    todo: [
      'Check the company on its official website',
      'Never pay to get a job',
      'Stop at the first request for money',
    ],
  },
  {
    id: 'parcel',
    icon: 'box',
    title: 'Parcel and customs fee',
    sum: 'A small fee is requested to release a parcel you did not expect.',
    flags: [
      'You are not waiting for a parcel',
      'A link on an unofficial-looking website',
      'A small fee to hide a bigger trap',
    ],
    todo: [
      'Track parcels only on the official courier app or site',
      'Do not enter card details on a link from a message',
      'Report the number as suspicious',
    ],
  },
  {
    id: 'power',
    icon: 'bolt',
    title: 'Electricity disconnection',
    sum: 'Your power will be cut tonight unless you pay or call a number.',
    flags: [
      'Disconnection "tonight" with a personal number to call',
      'Asks to install an app or pay to a personal UPI ID',
      'Does not match your real bill',
    ],
    todo: [
      'Check your bill on the official provider website or app',
      'Do not call the number in the message',
      'Pay only through official channels',
    ],
  },
  {
    id: 'care',
    icon: 'headset',
    title: 'Fake customer care numbers',
    sum: 'A number found on a search result turns out to be a scammer.',
    flags: [
      'Asks you to install a remote-access app',
      'Asks for OTP "to fix" an issue',
      "Number is not on the company's own website",
    ],
    todo: [
      'Get support numbers only from the official website or app',
      'Never install screen-sharing apps for a stranger',
      'End the call if they ask for any PIN or OTP',
    ],
  },
  {
    id: 'invest',
    icon: 'trend',
    title: 'Investment and trading groups',
    sum: 'A group promises guaranteed profits and pushes you to invest quickly.',
    flags: [
      '"Guaranteed" or very high returns',
      'Added to a group you did not join',
      'Pressure to add more money for "bigger profits"',
    ],
    todo: [
      'Use only registered, well-known platforms',
      'Ignore tips from unknown groups',
      'Do not transfer money to personal accounts',
    ],
  },
  {
    id: 'police',
    icon: 'badge',
    title: '"Digital arrest" and police impersonation',
    sum: 'Callers pretend to be police or officials and say you are under arrest.',
    flags: [
      'A video or voice call claiming you are being "arrested"',
      'Demands money to "settle" a case',
      'Tells you to keep it secret from family',
    ],
    todo: [
      'Hang up. Real agencies do not arrest people over video calls',
      'Talk to a family member or friend straight away',
      'Report the call on 1930',
    ],
  },
]

const TIPS = [
  [
    'Never share your OTP',
    'Banks and officials will never ask for your OTP, UPI PIN, CVV or password.',
  ],
  [
    'Urgent? Slow down',
    'Scammers create panic. A real problem will still be there after a calm check.',
  ],
  [
    'Check the link',
    'Do not tap links in unexpected messages. Open the official app or website yourself.',
  ],
  [
    'No PIN to receive money',
    'You only enter a UPI PIN to send money, never to receive it.',
  ],
  [
    'Avoid remote apps',
    'Do not install screen-sharing apps because a caller asked you to.',
  ],
  [
    'Talk to someone',
    'Tell a family member or friend before you pay when something feels off.',
  ],
]

const RULES = [
  'Never share OTP, PIN, CVV or passwords with anyone.',
  'Do not click links in messages you did not expect.',
  'Verify using official apps and websites only.',
  'Be careful when you feel rushed or scared.',
  'Report fraud quickly on 1930.',
]

const SAMPLES = [
  [
    'Fake KYC',
    'Dear customer, your bank account will be blocked today. Update your KYC immediately: http://bit.ly/kyc-update',
  ],
  [
    'Lottery',
    'Congratulations! You won ₹25,00,000 in the lucky draw. Pay ₹4,999 processing fee to claim your prize.',
  ],
  [
    'Parcel fee',
    'Your parcel is held at customs. Pay a small delivery fee here: http://india-post-track.xyz',
  ],
  [
    'UPI refund',
    'Please approve the UPI collect request to receive your refund of ₹2,000.',
  ],
]

const LINK_SAMPLES = [
  ['Fake bank KYC', 'http://sbi-kyc-update.xyz/login'],
  ['Aadhaar update', 'http://uidai-aadhaar-update.top/kyc'],
  ['Short link', 'https://bit.ly/3abc'],
  ['SBI example', 'https://sbi.bank.in'],
]

const EMAIL_SAMPLES = [
  [
    'Fake bank email',
    'From: "SBI Alerts" <alerts@sbi-kyc-update.xyz>\nReply-To: helpdesk.sbi@gmail.com\nSubject: Your account will be blocked\nAuthentication-Results: spf=fail; dkim=none; dmarc=fail\n\nDear customer, your KYC is expired. Click http://sbi-kyc-update.xyz/login to update now or your account will be blocked. Share OTP to confirm.',
  ],
  [
    'Prize email',
    'From: Lucky Winner <claim@prize-center.top>\nSubject: You won!\n\nCongratulations! You have won a lottery of Rs 25 lakh. Click http://bit.ly/abc123 to claim your prize.',
  ],
  [
    'Security alert example',
    'From: Google <no-reply@accounts.google.com>\nSubject: Security alert\nAuthentication-Results: spf=pass; dkim=pass; dmarc=pass\n\nA new sign-in was detected on your account. If this was you, no action is needed.',
  ],
]

const AFTER_STEPS = [
  [
    'Call 1930 right away',
    'The national cyber fraud helpline. Faster reporting gives a better chance of action.',
  ],
  [
    'Tell your bank',
    "Call your bank's official number and ask them to block cards, UPI or net banking.",
  ],
  [
    'Report online',
    'File a complaint on the national cybercrime portal with all details.',
  ],
  [
    'Stop contact',
    'Do not reply, pay again or share more details with the scammer.',
  ],
  [
    'Change passwords',
    'Update compromised passwords and payment PINs from a safe device.',
  ],
  [
    'Warn family',
    'Tell people close to you so they do not receive the same trick.',
  ],
]

const EVIDENCE = [
  'Screenshots of messages, chats and numbers',
  'Transaction ID, date and amount',
  'Phone numbers, UPI IDs or bank accounts used',
  'Links or website names you were sent',
  'Call time and what was said',
]

const FAQ = [
  [
    'Is it safe to paste a message here?',
    'Paste only the message text. Never paste OTPs, PINs, passwords, card numbers or other private bank details. Checks are sent to the connected server.',
  ],
  [
    'Can Scam Shield prove a message is a scam?',
    'No. It shows which warning rules match. A low result does not guarantee that a message is safe, so always verify through official channels.',
  ],
  [
    'I already clicked a link. What now?',
    'Do not enter any details. If you did, call your bank and 1930 right away, then change compromised passwords.',
  ],
  [
    'Will I get my money back?',
    'There is no guarantee, but reporting quickly gives the best chance. Call 1930 as soon as you notice.',
  ],
  [
    'Who should I contact?',
    'Call 1930 for cyber fraud, contact your bank about your accounts, and use the official cybercrime portal for a complaint.',
  ],
]

const MODES = {
  message: {
    label: 'Message',
    kicker: 'Message checker',
    intro: 'Paste a suspicious SMS or WhatsApp message below.',
    fieldLabel: 'Suspicious message',
    placeholder: 'Paste the message here...',
    button: 'Check message',
    endpoint: '/api/scan/message',
    key: 'message',
    rows: 6,
    max: 2000,
    empty: 'Paste a suspicious message first.',
    note: 'This gives guidance from matched rules. It does not prove that a message is safe or fraudulent.',
  },
  link: {
    label: 'Link',
    kicker: 'Link checker',
    intro: 'Paste a suspicious link below to check it.',
    fieldLabel: 'Suspicious link',
    placeholder: 'https://...',
    button: 'Check link',
    endpoint: '/api/scan/link',
    key: 'url',
    rows: 3,
    max: 500,
    empty: 'Paste a link first.',
    note: 'This checks the name and shape of the link. It cannot see inside the website, so it does not prove a link is safe.',
  },
    image: {
    label: 'Camera',
    kicker: 'Image checker',
    intro: 'Take a photo of a payment screenshot, message or document and check it.',
    note: 'The image is sent to the connected server for analysis. This gives warning signs only. A screenshot never proves a payment, so always check your own bank or UPI app.',
  },
  email: {
    label: 'Email',
    kicker: 'Email checker',
    intro: 'Paste the whole email below. Include the From line and headers if you can.',
    fieldLabel: 'Suspicious email',
    placeholder: 'Paste the email here (From, Subject, headers and body)...',
    button: 'Check email',
    endpoint: '/api/scan/email',
    key: 'email',
    rows: 10,
    max: 20000,
    empty: 'Paste the email first.',
    note: 'This checks the sender, the links and the words in the email. Pasted authentication headers can be forged. It does not prove an email is safe or fake.',
  },
  document: {
    label: 'Document',
    kicker: 'Document checker',
    intro: 'Upload a PDF or a Word, Excel or PowerPoint file to check it.',
    note: 'Files are sent to the connected server for analysis. This cannot prove a file is safe or replace antivirus checks. Never open files from unknown senders.',
  },
  
}
const MODE_ICONS = {
  message: 'chat',
  link: 'link',
  image: 'camera',
  email: 'mail',
  document: 'file',
}

function Acc({ open, onToggle, icon, title, sub, id, children }) {
  return (
    <div className={`acc ${open ? 'open' : ''}`} id={id}>
      <button
        type="button"
        className="acc-head"
        onClick={onToggle}
        aria-expanded={open}
      >
        {icon && (
          <span className="acc-icon">
            <Icon name={icon} size={20} />
          </span>
        )}
        <span className="acc-title">
          <b>{title}</b>
          {sub && <small>{sub}</small>}
        </span>
        <Icon name="chevron" size={20} />
      </button>
      <div className="acc-body" aria-hidden={!open} inert={!open}>
        <div>{children}</div>
      </div>
    </div>
  )
}

function Gauge({ score, tone }) {
  const target = Math.min(100, Math.max(0, Number(score) || 0))
  const value = useCountUp(target, true, 1300)
  const circumference = 2 * Math.PI * 54

  return (
    <div
      className={`gauge ${tone}`}
      role="img"
      aria-label={`Warning score ${target} out of 100`}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="g-track" cx="60" cy="60" r="54" />
        <circle
          className="g-fill"
          cx="60"
          cy="60"
          r="54"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div>
        <strong>{value}</strong>
        <small>/100</small>
      </div>
    </div>
  )
}

function ScanResult({ result, note }) {
  if (!result) return null

  const findings = result.findings.filter(
    (finding) =>
      typeof finding === 'string' ||
      (finding && typeof finding.reason === 'string'),
  )

  return (
    <section className={`result ${result.level}`} aria-live="polite">
      <div className="result-top">
        <Gauge score={result.score} tone={result.level} />
        <div>
          <span className="mini">Warning level</span>
          <h3>{result.level} risk</h3>
        </div>
      </div>
            {typeof result.verdict === 'string' && result.verdict.trim() && (
        <p className="verdict">{result.verdict}</p>
      )}

      {typeof result.fileName === 'string' && (
        <p className="file-meta">
          {result.fileName}
          {typeof result.fileType === 'string' && ` · ${result.fileType}`}
        </p>
      )}
            {Array.isArray(result.about) && result.about.length > 0 && (
        <>
          <h4>About this image</h4>
          <ul className="about-list">
            {result.about
              .filter((line) => typeof line === 'string')
              .map((line, index) => (
                <li key={index} style={{ '--i': index }}>{line}</li>
              ))}
          </ul>
        </>
      )}

      <h4>What was found</h4>

      {findings.length > 0 ? (
        <ul>
          {findings.map((finding, index) => {
            const item =
              typeof finding === 'string' ? { reason: finding } : finding
            const source = safeSource(item.sourceUrl)

            return (
              <li key={index} style={{ '--i': index }}>
                <span className="tick">
                  <Icon name="alert" size={14} />
                </span>
                <div>
                  <p>
                    {item.reason}{' '}
                    {typeof item.points === 'number' && item.points > 0 && (
                      <b className="pts">+{item.points}</b>
                    )}
                  </p>
                  {source && (
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {typeof item.sourceName === 'string'
                        ? item.sourceName
                        : 'View source'}
                      <Icon name="link" size={14} />
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="result-note">
          No detailed findings were returned. This does not guarantee safety.
        </p>
      )}

      <p className="note">{note}</p>
    </section>
  )
}

function Stat({ end, suffix = '', label, active }) {
  const value = useCountUp(end, active, 1700)

  return (
    <div className="stat">
      <strong>{value}{suffix}</strong>
      <span>{label}</span>
    </div>
  )
}

function TipCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)

  useEffect(() => {
    if (
      paused ||
      interacting ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % TIPS.length),
      4200,
    )

    return () => window.clearInterval(timer)
  }, [index, paused, interacting])

  return (
    <div
      className="carousel"
      aria-label="Safety tips"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setInteracting(false)
        }
      }}
    >
      <div
        className="car-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {TIPS.map(([title, description], tipIndex) => (
          <article
            className="tip"
            key={title}
            aria-hidden={tipIndex !== index}
          >
            <span className="tip-no">
              {String(tipIndex + 1).padStart(2, '0')}
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="dots">
        <button
          type="button"
          className="carousel-toggle"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? 'Resume tips' : 'Pause tips'}
          title={paused ? 'Resume tips' : 'Pause tips'}
        >
          <Icon name={paused ? 'play' : 'pause'} size={16} />
        </button>
        {TIPS.map(([title], tipIndex) => (
          <button
            type="button"
            key={title}
            className={tipIndex === index ? 'on' : ''}
            onClick={() => setIndex(tipIndex)}
            aria-label={`Show tip ${tipIndex + 1}`}
            aria-pressed={tipIndex === index}
          />
        ))}
      </div>
    </div>
  )
}

function CommunitySearch() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const { request, cancel, loading } = useRequest()

  async function search(event) {
    event.preventDefault()
    if (loading) return

    setResult(null)
    setError('')

    if (!value.trim()) {
      setError('Enter a phone number or UPI ID.')
      return
    }

    try {
      const data = await request('/api/community/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: value.trim() }),
      })

      if (!data) return

      if (!Number.isInteger(data.reportCount) || data.reportCount < 0) {
        throw new Error('The server returned an invalid search result.')
      }

      setResult({
        ...data,
        reasons: Array.isArray(data.reasons)
          ? data.reasons.filter((reason) => typeof reason === 'string')
          : [],
      })
    } catch (err) {
      setError(err.message || 'Search is unavailable. Please try again.')
    }
  }

  return (
    <section className="scanner community-search" id="search">
      <div className="scanner-inner">
        <p className="eyebrow">Community database</p>
        <h2>Search a Number or UPI</h2>
        <p className="sub">
          Check if a phone number or UPI ID has been reported by others.
        </p>

        <form onSubmit={search} aria-busy={loading}>
          <label className="form-label" htmlFor="community-value">
            Phone number or UPI ID
          </label>
          <input
            id="community-value"
            type="text"
            className="custom-input"
            value={value}
            maxLength={254}
            autoComplete="off"
            placeholder="Enter phone number or UPI ID"
            onChange={(event) => {
              cancel()
              setValue(event.target.value)
              setResult(null)
              setError('')
            }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-block form-submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search database'}
          </button>
        </form>

        <ErrorMessage>{error}</ErrorMessage>

        {result && (
          <div
            className={`result ${result.reportCount > 0 ? 'high' : 'neutral'}`}
            role="status"
          >
            <p className="mini-label">Database result</p>
            <h3>
              {result.reportCount > 0
                ? `${result.reportCount} reports found`
                : 'No reports found'}
            </h3>

            {result.reasons.length > 0 && (
              <ul>
                {result.reasons.map((reason, index) => (
                  <li key={index} style={{ '--i': index }}>
                    <span className="tick">!</span>
                    <p>{reason}</p>
                  </li>
                ))}
              </ul>
            )}

            <p className="result-note">
              Reports are community submissions, not verified findings. No
              reports does not mean a number or UPI ID is safe.
            </p>
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
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { request, loading } = useRequest()

  function clearFeedback() {
    setMessage('')
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    if (loading) return

    clearFeedback()

    if (!value.trim() || !reason.trim()) {
      setError('Enter the number or UPI ID and a reason.')
      return
    }

    try {
      const data = await request('/api/community/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          value: value.trim(),
          reason: reason.trim(),
        }),
      })

      if (!data) return

      if (
        data.success === false ||
        typeof data.message !== 'string' ||
        !data.message.trim()
      ) {
        throw new Error(
          'The server did not confirm your report. Please try again.',
        )
      }

      setMessage(data.message)
      setValue('')
      setReason('')
    } catch (err) {
      setError(err.message || 'Could not submit your report. Please try again.')
    }
  }

  return (
    <section className="scanner community-report" id="report">
      <div className="scanner-inner">
        <p className="eyebrow">Help others</p>
        <h2>Report suspicious activity</h2>
        <p className="sub">
          Submit a suspicious number or UPI ID to protect the community. Do
          not include private banking details.
        </p>

        <form onSubmit={submit} aria-busy={loading}>
          <label className="form-label" htmlFor="report-type">
            Report type
          </label>
          <select
            id="report-type"
            className="custom-input"
            value={type}
            disabled={loading}
            onChange={(event) => {
              setType(event.target.value)
              clearFeedback()
            }}
          >
            <option value="PHONE">Phone number</option>
            <option value="UPI">UPI ID</option>
          </select>

          <label className="form-label" htmlFor="report-value">
            {type === 'PHONE' ? 'Phone number' : 'UPI ID'}
          </label>
          <input
            id="report-value"
            type="text"
            className="custom-input"
            value={value}
            maxLength={254}
            disabled={loading}
            autoComplete="off"
            placeholder="Enter number or UPI ID"
            onChange={(event) => {
              setValue(event.target.value)
              clearFeedback()
            }}
          />

          <label className="form-label" htmlFor="report-reason">
            What happened?
          </label>
          <textarea
            id="report-reason"
            rows={3}
            value={reason}
            maxLength={2000}
            disabled={loading}
            placeholder="Describe the suspicious activity"
            onChange={(event) => {
              setReason(event.target.value)
              clearFeedback()
            }}
          />

          <button
            type="submit"
            className="btn btn-primary btn-block form-submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit report'}
          </button>
        </form>

        <ErrorMessage>{error}</ErrorMessage>
        {message && (
          <p className="form-success" role="status">
            {message}
          </p>
        )}
      </div>
    </section>
  )
}

function HomeTab({ go, openScam }) {
  const [statRef, statIn] = useInView(0.3)
  const [stepsRef, stepsIn] = useInView(0.2)
  const [live, setLive] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/stats', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (
          !controller.signal.aborted &&
          data &&
          ['total', 'high', 'medium'].every(
            (key) => Number.isInteger(data[key]) && data[key] >= 0,
          )
        ) {
          setLive(data)
        }
      })
      .catch(() => {
        // Optional statistics stay hidden when unavailable.
      })

    return () => controller.abort()
  }, [])

  const actions = [
    ['scan', 'Check message', 'Scan for warning signs', () => go('check')],
    ['book', 'Learn scams', `${SCAMS.length} common patterns`, () => go('learn')],
    ['help', 'After a scam', 'Steps to take now', () => go('help')],
  ]

  return (
    <>
      <section className="hero-card">
        <div className="hero-shield" aria-hidden="true">
          <i /><i /><i />
          <div><Icon name="shield" size={34} /></div>
        </div>
        <p className="kicker">Ready to help</p>
        <h1>Pause. Check. <span className="grad-text">Then act.</span></h1>
        <p className="hero-text">
          Paste any suspicious here to identify its state and score. So you can aware from it. 
        </p>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => go('check')}
        >
          Click Here to check <Icon name="arrow" size={19} />
        </button>
      </section>

      <div className="alert-strip" role="note">
        <span><Icon name="alert" size={18} /></span>
        <div className="alert-marquee">
          <p>
            Never share your OTP, UPI PIN, CVV or password with anyone, not
            even bank staff.
          </p>
        </div>
      </div>

      <Section kicker="Quick actions" title="What do you need?">
        <div className="quick">
          {actions.map(([icon, title, description, onClick], index) => (
            <Reveal key={title} delay={index * 90}>
              <button
                type="button"
                className="quick-card"
                onClick={onClick}
              >
                <span className="q-icon"><Icon name={icon} size={22} /></span>
                <b>{title}</b>
                <small>{description}</small>
              </button>
            </Reveal>
          ))}
          <Reveal delay={270}>
            <a className="quick-card call" href="tel:1930">
              <span className="q-icon"><Icon name="phone" size={22} /></span>
              <b>Call 1930</b>
              <small>Cyber fraud helpline</small>
            </a>
          </Reveal>
        </div>
      </Section>

      <Section kicker="Daily safety" title="Tips that protect you">
        <Reveal><TipCarousel /></Reveal>
      </Section>

      <section className="stats" ref={statRef}>
        <div className="stat">
          <strong>1930</strong>
          <span>Helpline number</span>
        </div>
        <Stat end={24} suffix="/7" label="Reporting open" active={statIn} />
        <Stat
          end={SCAMS.length}
          label="Scam types covered"
          active={statIn}
        />
      </section>

      {live && (
        <section className="stats live-stats">
          <Stat end={live.total} label="Checks done" active={statIn} />
          <Stat end={live.high} label="High-risk found" active={statIn} />
          <Stat end={live.medium} label="Medium-risk found" active={statIn} />
        </section>
      )}

      <Section kicker="How it works" title="Three calm steps">
        <div className={`timeline ${stepsIn ? 'in' : ''}`} ref={stepsRef}>
          <div className="tl-line" aria-hidden="true" />
          {[
            [
              'Paste the message',
              'Copy the suspicious SMS, chat or email into the checker.',
            ],
            [
              'Read the evidence',
              'See the warning rules that matched and open their sources.',
            ],
            [
              'Verify or report',
              'Use official channels if your money or data may be at risk.',
            ],
          ].map(([title, description], index) => (
            <article key={title} style={{ '--i': index }}>
              <span className="tl-no">{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        kicker="Know the patterns"
        title="Common scams"
        action={
          <button
            type="button"
            className="text-btn"
            onClick={() => go('learn')}
          >
            See all
          </button>
        }
      >
        <div className="list">
          {SCAMS.slice(0, 4).map((scam, index) => (
            <Reveal key={scam.id} delay={index * 80}>
              <button
                type="button"
                className="row-card"
                onClick={() => openScam(scam.id)}
              >
                <span className="row-icon">
                  <Icon name={scam.icon} size={21} />
                </span>
                <span className="row-text">
                  <b>{scam.title}</b><small>{scam.sum}</small>
                </span>
                <Icon name="arrow" size={18} />
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section kicker="Remember" title="5 golden rules">
        <div className="rules">
          {RULES.map((rule, index) => (
            <Reveal key={rule} delay={index * 70}>
              <div className="rule">
                <span>{index + 1}</span><p>{rule}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CommunitySearch />
      <Reveal><SubmitReport /></Reveal>

      <Reveal>
        <section className="cta-card">
          <div className="cta-spin" aria-hidden="true" />
          <div className="cta-in">
            <h2>A quick check can prevent a costly mistake.</h2>
            <button
              type="button"
              className="btn btn-light btn-block"
              onClick={() => go('check')}
            >
              Check a message <Icon name="arrow" size={19} />
            </button>
          </div>
        </section>
      </Reveal>

      <p className="fine">
        <Icon name="lock" size={15} />
        Never paste OTPs, PINs, passwords or bank details into this app.
      </p>
    </>
  )
}

function DocumentScan({ note }) {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)
  const { request, cancel, loading } = useRequest()

  function choose(next) {
    if (!next) return

    cancel()
    setResult(null)
    setError('')
    setFile(null)

    if (!DOCUMENT_EXTENSIONS.test(next.name)) {
      setError('Choose a PDF, Word, Excel or PowerPoint file.')
      return
    }

    if (!next.size) {
      setError('The selected file is empty.')
      return
    }

    if (next.size > MAX_FILE_BYTES) {
      setError('File is larger than 10 MB.')
      return
    }

    setFile(next)
  }

  async function scan(event) {
    event.preventDefault()
    if (loading) return

    setError('')
    setResult(null)

    if (!file) {
      setError('Choose a file first.')
      return
    }

    try {
      const form = new FormData()
      form.append('file', file)

      const data = await request('/api/scan/document', {
        method: 'POST',
        body: form,
      })

      if (data) setResult(validateScan(data))
    } catch (err) {
      setError(
        err.message ||
          'Could not scan the file. Please check your connection and the server.',
      )
    }
  }

  return (
    <>
      <form onSubmit={scan} aria-busy={loading}>
        <label htmlFor="docfile">Suspicious document</label>
        <input
          id="docfile"
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.docm,.xls,.xlsx,.xlsm,.ppt,.pptx,.pptm"
          onChange={(event) => {
            choose(event.target.files?.[0])
            event.target.value = ''
          }}
        />

        <button
          type="button"
          className={`dropzone ${file ? 'has-file' : ''} ${drag ? 'drag' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDrag(false)
            choose(event.dataTransfer.files?.[0])
          }}
        >
          <Icon name="file" size={30} />
          {file ? (
            <>
              <b>{file.name}</b>
              <small>
                {Math.max(1, Math.round(file.size / 1024))} KB · tap to change
              </small>
            </>
          ) : (
            <>
              <b>Tap to choose a file</b>
              <small>PDF, Word, Excel or PowerPoint · max 10 MB</small>
            </>
          )}
        </button>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading || !file}
        >
          {loading ? (
            <><span className="spinner" /> Scanning...</>
          ) : (
            <><Icon name="scan" size={19} /> Scan document</>
          )}
        </button>
      </form>

      <ErrorMessage>{error}</ErrorMessage>
      {!result && <p className="note">{note}</p>}
      <ScanResult result={result} note={note} />
    </>
  )
}
function ImageScan({ note }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const cameraRef = useRef(null)
  const galleryRef = useRef(null)
  const { request, cancel, loading } = useRequest()

  useEffect(() => () => URL.revokeObjectURL(preview), [preview])

  function choose(next) {
    if (!next) return

    cancel()
    setResult(null)
    setError('')
    setFile(null)
    setPreview('')

    if (!next.type.startsWith('image/')) {
      setError('Take or choose an image file.')
      return
    }
    if (!next.size) {
      setError('The selected image is empty.')
      return
    }
    if (next.size > MAX_FILE_BYTES) {
      setError('Image is larger than 10 MB.')
      return
    }

    setFile(next)
    setPreview(URL.createObjectURL(next))
  }

  async function scan(event) {
    event.preventDefault()
    if (loading) return

    setError('')
    setResult(null)

    if (!file) {
      setError('Take or choose a photo first.')
      return
    }

    try {
      const form = new FormData()
      form.append('file', file)

      const data = await request('/api/scan/image', {
        method: 'POST',
        body: form,
      })

      if (data) setResult(validateScan(data))
    } catch (err) {
      setError(err.message || 'Could not scan the image. Please try again.')
    }
  }

  const onPick = (event) => {
    choose(event.target.files?.[0])
    event.target.value = ''
  }

  return (
    <>
      <form onSubmit={scan} aria-busy={loading}>
        <label>Photo to check</label>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={onPick} />
        <input ref={galleryRef} type="file" accept="image/*" hidden onChange={onPick} />

        <div
          className={`field cam-preview ${loading ? 'scanning' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Open camera to take a photo"
          onClick={() => cameraRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              cameraRef.current?.click()
            }
          }}
        >
          {preview ? (
            <img src={preview} alt="Selected photo to check" />
          ) : (
            <div className="cam-empty">
              <Icon name="camera" size={44} />
              <b>Tap to open camera</b>
              <small>Photograph the screenshot, payment slip or message</small>
            </div>
          )}
          <button
            type="button"
            className="cam-gallery"
            onClick={(event) => {
              event.stopPropagation()
              galleryRef.current?.click()
            }}
          >
            <Icon name="file" size={15} /> Gallery
          </button>
          <span className="laser" aria-hidden="true" />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading || !file}>
          {loading ? (
            <><span className="spinner" /> Analysing...</>
          ) : (
            <><Icon name="scan" size={19} /> Analyse image</>
          )}
        </button>
      </form>

      <ErrorMessage>{error}</ErrorMessage>
      {!result && <p className="note">{note}</p>}
      <ScanResult result={result} note={note} />
    </>
  )
}

function CheckTab() {
  const [mode, setMode] = useState('message')
  const [values, setValues] = useState({ message: '', link: '', email: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const { request, cancel, loading } = useRequest()

  const config = MODES[mode]
  const value = values[mode] || ''
  const samples =
    mode === 'message'
      ? SAMPLES
      : mode === 'link'
        ? LINK_SAMPLES
        : EMAIL_SAMPLES

  function changeMode(next) {
    if (next === mode) return

    cancel()
    setMode(next)
    setResult(null)
    setError('')
  }

  function changeValue(next) {
    cancel()
    setValues((previous) => ({ ...previous, [mode]: next }))
    setResult(null)
    setError('')
  }

  async function scan(event) {
    event.preventDefault()
    if (loading) return

    setError('')
    setResult(null)

    const text = value.trim()

    if (!text) {
      setError(config.empty)
      return
    }

    if (value.length > config.max) {
      setError(`Keep your input under ${config.max} characters.`)
      return
    }

    if (mode === 'link') {
      try {
        const url = new URL(text)
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
      } catch {
        setError('Enter a valid link starting with https:// or http://.')
        return
      }
    }

    try {
      const data = await request(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [config.key]: text }),
      })

      if (data) setResult(validateScan(data))
    } catch (err) {
      setError(
        err.message ||
          'Could not check this input. Please check your connection and the server.',
      )
    }
  }

  return (
    <>
      <section className="page-head">
        <p className="kicker">Check</p>
        <h1>Pause before you <span className="grad-text">trust.</span></h1>
      </section>

           <div className="mode-tabs" role="group" aria-label="Check type">
        {Object.entries(MODES).map(([key, item]) => (
          <button
            type="button"
            key={key}
            className={`${mode === key ? 'on' : ''} ${key === 'image' ? 'cam' : ''}`}
            aria-pressed={mode === key}
            onClick={() => changeMode(key)}
          >
            <Icon name={MODE_ICONS[key]} size={key === 'image' ? 34 : 27} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <section className="card checker">
        <p className="kicker">{config.kicker}</p>
        <p className="sub">{config.intro}</p>

               {mode === 'document' ? (
          <DocumentScan note={config.note} />
        ) : mode === 'image' ? (
          <ImageScan note={config.note} />
        ) : (
          <>
            <div className="chips">
              {samples.map(([label, text]) => (
                <button
                  type="button"
                  className="chip"
                  key={label}
                  onClick={() => changeValue(text)}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={scan} aria-busy={loading}>
              <label htmlFor="scan-input">{config.fieldLabel}</label>
              <div className={`field ${loading ? 'scanning' : ''}`}>
                <textarea
                  id="scan-input"
                  value={value}
                  onChange={(event) => changeValue(event.target.value)}
                  placeholder={config.placeholder}
                  rows={config.rows}
                  maxLength={config.max}
                  spellCheck={false}
                  aria-describedby="scan-limit scan-note"
                />
                <span className="laser" aria-hidden="true" />
              </div>

              <div className="field-foot" id="scan-limit">
                <span>{value.length}/{config.max}</span>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => changeValue('')}
                  disabled={!value && !result}
                >
                  Clear
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" /> Checking...</>
                ) : (
                  <><Icon name="scan" size={19} /> {config.button}</>
                )}
              </button>
            </form>

            <ErrorMessage>{error}</ErrorMessage>
            <p className="note" id="scan-note">{config.note}</p>
            <ScanResult result={result} note={config.note} />
          </>
        )}
      </section>

      <p className="fine">
        <Icon name="lock" size={15} />
        Never paste OTPs, PINs, passwords or bank details into this app.
      </p>
    </>
  )
}

function LearnTab({ openId, setOpenId }) {
  const [query, setQuery] = useState('')
  const searchText = query.trim().toLowerCase()

  const list = SCAMS.filter((scam) =>
    [
      scam.title,
      scam.sum,
      ...scam.flags,
      ...scam.todo,
    ].join(' ').toLowerCase().includes(searchText),
  )

  useEffect(() => {
    if (!openId) return

    const timer = window.setTimeout(() => {
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      document.getElementById(`scam-${openId}`)?.scrollIntoView({
        behavior: reduced ? 'instant' : 'smooth',
        block: 'center',
      })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [openId])

  return (
    <>
      <section className="page-head">
        <p className="kicker">Learn</p>
        <h1>
          Scams that keep <span className="grad-text">coming back.</span>
        </h1>
        <p>Tap a scam to see the red flags and what to do instead.</p>
      </section>

      <label className="search">
        <Icon name="search" size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search scams (e.g. UPI, parcel)"
          aria-label="Search scams"
        />
      </label>

      <div className="acc-list">
        {list.map((scam, index) => (
          <Reveal key={scam.id} delay={Math.min(index, 4) * 60}>
            <Acc
              id={`scam-${scam.id}`}
              icon={scam.icon}
              title={scam.title}
              sub={scam.sum}
              open={openId === scam.id}
              onToggle={() =>
                setOpenId(openId === scam.id ? null : scam.id)
              }
            >
              <h4 className="sub-red">
                <Icon name="alert" size={16} /> Red flags
              </h4>
              <ul className="dots-list red">
                {scam.flags.map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
              <h4 className="sub-green">
                <Icon name="shield" size={16} /> What to do
              </h4>
              <ul className="dots-list green">
                {scam.todo.map((action) => <li key={action}>{action}</li>)}
              </ul>
            </Acc>
          </Reveal>
        ))}

        {list.length === 0 && (
          <p className="empty">
            No scam found for &quot;{query}&quot;. Try another word.
          </p>
        )}
      </div>

      <section className="info-card">
        <span><Icon name="spark" size={21} /></span>
        <div>
          <b>Not sure about a message?</b>
          <p>Use the Check tab to see which warning signs match.</p>
        </div>
      </section>
    </>
  )
}

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
        <span className="sos-ring">
          <i /><i /><Icon name="phone" size={28} />
        </span>
        <span>
          <small>National cyber fraud helpline</small>
          <b>Call 1930</b>
        </span>
        <Icon name="arrow" size={22} />
      </a>

      <Section kicker="Step by step" title="What to do right now">
        <div className="steps">
          {AFTER_STEPS.map(([title, description], index) => (
            <Reveal key={title} delay={(index % 3) * 70}>
              <article className="step">
                <span>{index + 1}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section kicker="Official channels" title="Report online">
        <div className="links">
          <Reveal>
            <a
              className="link-card"
              href="https://www.cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span><Icon name="badge" size={22} /></span>
              <div>
                <b>National Cybercrime Portal</b>
                <small>cybercrime.gov.in · file a complaint</small>
              </div>
              <Icon name="link" size={18} />
            </a>
          </Reveal>
          <Reveal delay={90}>
            <a
              className="link-card"
              href="https://sancharsaathi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span><Icon name="phone" size={22} /></span>
              <div>
                <b>Sanchar Saathi</b>
                <small>
                  sancharsaathi.gov.in · report suspicious calls and messages
                </small>
              </div>
              <Icon name="link" size={18} />
            </a>
          </Reveal>
        </div>
      </Section>

      <Section kicker="Keep proof" title="Collect evidence">
        <Reveal>
          <div className="card">
            <div
              className="prog"
              role="progressbar"
              aria-label="Evidence collected"
              aria-valuemin={0}
              aria-valuemax={EVIDENCE.length}
              aria-valuenow={count}
            >
              <i style={{ width: `${(count / EVIDENCE.length) * 100}%` }} />
            </div>
            <p className="prog-text">{count} of {EVIDENCE.length} ready</p>

            {EVIDENCE.map((item, index) => (
              <button
                type="button"
                key={item}
                className={`check-row ${done[index] ? 'on' : ''}`}
                aria-pressed={done[index]}
                onClick={() =>
                  setDone((previous) =>
                    previous.map((value, itemIndex) =>
                      itemIndex === index ? !value : value,
                    ),
                  )
                }
              >
                <span><Icon name="check" size={14} /></span>
                {item}
              </button>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section kicker="Questions" title="Quick answers">
        <div className="acc-list">
          {FAQ.map(([question, answer], index) => (
            <Acc
              key={question}
              title={question}
              open={faq === index}
              onToggle={() => setFaq(faq === index ? -1 : index)}
            >
              <p className="faq-a">{answer}</p>
            </Acc>
          ))}
        </div>
      </Section>

      <p className="fine">
        <Icon name="lock" size={15} />
        This app gives guidance only. It is not legal or police advice.
      </p>
    </>
  )
}

const TABS = [
  ['home', 'Home', 'home'],
  ['check', 'Check', 'scan'],
  ['learn', 'Learn', 'book'],
  ['help', 'Help', 'help'],
]

function AppShell() {
  const [tab, setTab] = useState('home')
  const [openId, setOpenId] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function go(next) {
    if (!TABS.some(([key]) => key === next)) return
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function openScam(id) {
    setOpenId(id)
    go('learn')
  }

  const index = TABS.findIndex(([key]) => key === tab)

  return (
    <div className="stage">
      <div className="device">
        <header className={`app-bar ${scrolled ? 'scrolled' : ''}`}>
          <div>
            <p className="status"><span /> Ready</p>
            <p className="app-name">
              {APP_NAME}
              <span className="live-dot" aria-hidden="true" />
            </p>
          </div>
          <a
            className="sos-mini"
            href="tel:1930"
            aria-label="Call cyber fraud helpline 1930"
          >
            <Icon name="phone" size={17} /> 1930
          </a>
        </header>

        <main className="screen" key={tab}>
          {tab === 'home' && <HomeTab go={go} openScam={openScam} />}
          {tab === 'check' && <CheckTab />}
          {tab === 'learn' && (
            <LearnTab openId={openId} setOpenId={setOpenId} />
          )}
          {tab === 'help' && <HelpTab />}
        </main>
      </div>

      <nav
        className="tabbar"
        aria-label="Main navigation"
        style={{ '--n': index }}
      >
        <i className="tab-pill" aria-hidden="true" />
        {TABS.map(([key, label, icon]) => (
          <button
            type="button"
            key={key}
            className={tab === key ? 'on' : ''}
            onClick={() => go(key)}
            aria-current={tab === key ? 'page' : undefined}
          >
            <Icon name={icon} size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useRef(() => setReady(true)).current

  useEffect(() => {
    if (document.getElementById('scam-shield-fonts')) return

    const link = document.createElement('link')
    link.id = 'scam-shield-fonts'
    link.rel = 'stylesheet'
    link.href = FONT_URL
    document.head.appendChild(link)
  }, [])

  return ready ? <AppShell /> : <Splash onDone={onDone} />
}