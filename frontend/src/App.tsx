import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      ready: (cb: () => void) => void
    }
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [recaptchaReady, setRecaptchaReady] = useState(false)
  const [verifyResult, setVerifyResult] = useState<string | null>(null)
  const ranOnce = useRef(false)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string

  useEffect(() => {
    if (!siteKey) {
      setVerifyResult('Missing VITE_RECAPTCHA_SITE_KEY in .env')
      return
    }
    const existing = document.querySelector('script[src*="recaptcha/api.js"]')
    if (existing) {
      const onReady = () => setRecaptchaReady(true)
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(onReady)
      } else {
        const check = () => {
          if (window.grecaptcha?.ready) {
            window.grecaptcha.ready(onReady)
          } else {
            setTimeout(check, 50)
          }
        }
        setTimeout(check, 50)
      }
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.onload = () => {
      const onReady = () => setRecaptchaReady(true)
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(onReady)
      } else {
        const check = () => {
          if (window.grecaptcha?.ready) {
            window.grecaptcha.ready(onReady)
          } else {
            setTimeout(check, 50)
          }
        }
        setTimeout(check, 50)
      }
    }
    document.head.appendChild(script)
  }, [siteKey])

  useEffect(() => {
    if (!recaptchaReady || !siteKey || ranOnce.current) return
    const run = () => {
      if (!window.grecaptcha?.execute) {
        ranOnce.current = true
        setVerifyResult('reCAPTCHA execute not available')
        return
      }
      ranOnce.current = true
      setVerifyResult('Checking…')
      window.grecaptcha
        .execute(siteKey, { action: 'page_view' })
        .then(async (token) => {
          const res = await fetch('http://localhost:3000/api/verify-recaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
          const data = await res.json()
          if (data.success) {
            setVerifyResult(`Success! Score: ${data.score ?? 'N/A'}, action: ${data.action ?? 'N/A'}`)
          } else {
            setVerifyResult(`Failed: ${data['error-codes']?.join(', ') ?? 'Verification failed'}`)
          }
        })
        .catch((err) => {
          setVerifyResult(`Error: ${err instanceof Error ? err.message : 'Request failed'}`)
        })
    }
    if (window.grecaptcha?.ready) {
      window.grecaptcha.ready(run)
    } else {
      run()
    }
  }, [recaptchaReady, siteKey])

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <div className="recaptcha-container">
        {verifyResult && <p className="verify-result">{verifyResult}</p>}
      </div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
