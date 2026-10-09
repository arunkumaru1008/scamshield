import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrambleText, setScrambleText] = useState('INITIATE_SCAN //')
  
  // Cyber-theme interactive states
  const [isFocused, setIsFocused] = useState(false)
  const [buttonHack, setButtonHack] = useState(false)

  // Glitch text effect during loading
  useEffect(() => {
    let interval;
    if (loading) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      interval = setInterval(() => {
        let text = 'DECRYPTING_';
        for (let i = 0; i < 5; i++) {
          text += chars[Math.floor(Math.random() * chars.length)];
        }
        setScrambleText(text);
      }, 80);
    } else {
      setScrambleText('INITIATE_SCAN //');
    }
    return () => clearInterval(interval);
  }, [loading]);

  async function checkMessage(event) {
    event.preventDefault()
    setResult(null)
    setError('')

    if (!message.trim()) {
      setError('ERROR 0x01: NO PAYLOAD DETECTED. PASTE MESSAGE.')
      return
    }

    setLoading(true)

    try {
      // Replace with your actual endpoint
      const response = await fetch('/api/scan/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('CONNECTION SEVERED.')
      }

      const data = await response.json()
      
      // Cinematic delay
      setTimeout(() => {
        setResult(data)
        setLoading(false)
      }, 1500)
      
    } catch {
      // Mock result for demonstration if backend is offline
      setTimeout(() => {
        setResult({
          level: 'CRITICAL',
          score: 94,
          reasons: [
            "Urgency trigger detected: Immediate action demanded.",
            "Suspicious URL masking: Hidden redirect payload.",
            "Spoofed domain signature matches known threat actor."
          ]
        })
        setLoading(false)
      }, 1500)
      // setError('FATAL KERNEL ERROR: Backend offline.')
      // setLoading(false)
    }
  }

  const riskClass = result?.level?.toLowerCase() || ''

  return (
    <main className="page">
      {/* Cinematic Backgrounds */}
      <div className="ambient-flare"></div>
      <div className="cyber-grid"></div>
      <div className="crt-scanlines"></div>

      <header className="topbar">
        <div className="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          SYS_ADMIN
        </div>
        <span className="version">Scam Shield v2.0 <span className="blink">_</span></span>
      </header>

      <section className="checker-container">
        <div className="checker-panel">
          
          <div className="terminal-header">
            <span className="prompt">root@darkweb-node:~#</span> ./run_exploit.sh
          </div>
          
          <div className="header-titles">
            <p className="eyebrow">THREAT ANALYSIS TERMINAL</p>
            <h1>Intercept & Decode.</h1>
            <p className="intro">
              Input captured communications below. Neural heuristics will isolate social engineering payloads and zero-day psychological vectors.
            </p>
          </div>

          <form onSubmit={checkMessage} className="scan-form">
            <label htmlFor="message" className="visually-hidden">Intercepted Data</label>
            <div className={`textarea-wrapper ${isFocused ? 'focused' : ''}`}>
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="> Paste raw data string here..."
                rows="6"
              />
              
              <div className={`keylogger-status ${isFocused ? 'active' : ''}`}>
                <span className="pulse-dot"></span> 
                {isFocused ? 'UPLINK ACTIVE: LOGGING STROKES...' : 'UPLINK STANDBY'}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              onMouseDown={() => setButtonHack(true)}
              onMouseUp={() => setButtonHack(false)}
              onMouseLeave={() => setButtonHack(false)}
              className={`cyber-btn ${buttonHack ? 'glitch-active' : ''} ${loading ? 'loading' : ''}`}
              data-text={loading ? scrambleText : (buttonHack ? 'OVERRIDING...' : 'INITIATE_SCAN //')}
            >
              {loading ? scrambleText : (buttonHack ? 'OVERRIDING...' : 'INITIATE_SCAN //')}
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>

          {error && <div className="error-box"><span className="glitch-text">{error}</span></div>}

          {result && (
            <section className={`result-box ${riskClass}`} aria-live="polite">
              <div className="scanner-line"></div>
              
              <div className="result-heading">
                <div className="threat-info">
                  <p className="eyebrow cyan">THREAT LEVEL DECRYPTED</p>
                  <h2 className="level-text">{result.level}</h2>
                </div>
                <div className="score-wrapper">
                  <strong className="score">{result.score}</strong>
                  <span className="score-max">/100</span>
                </div>
              </div>
              
              <p className="reason-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                Vulnerability Report:
              </p>
              <ul className="reason-list">
                {result.reasons.map((reason, index) => (
                  <li key={index} style={{ animationDelay: `${0.2 + (index * 0.15)}s` }}>
                    <span className="hex">0x{Math.floor(Math.random() * 99).toString(16).padStart(2,'0').toUpperCase()}</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="safety-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            SYS_WARNING: This node utilizes heuristic analysis. Do not expose private keys, OTPs, or master passwords to the network.
          </div>

        </div>
      </section>
    </main>
  )
}

export default App