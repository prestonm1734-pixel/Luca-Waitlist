'use client';

import { useState } from 'react';

const SUPABASE_URL = 'https://ioeqnfqparfunotdjosy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WgGtHiiEJJ-EJzYrG5jV7g_XlZnxTAJ';

function LucaLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="46" y="14" width="8" height="8" rx="1.5" fill="#FAFAFA" />
      <rect x="78" y="46" width="8" height="8" rx="1.5" fill="#FAFAFA" />
      <rect x="46" y="78" width="8" height="8" rx="1.5" fill="#FAFAFA" />
      <rect x="14" y="46" width="8" height="8" rx="1.5" fill="#FAFAFA" />
      <rect x="69" y="23" width="8" height="8" rx="1.5" transform="rotate(45 73 27)" fill="#FAFAFA" />
      <rect x="69" y="69" width="8" height="8" rx="1.5" transform="rotate(45 73 73)" fill="#FAFAFA" />
      <rect x="23" y="69" width="8" height="8" rx="1.5" transform="rotate(45 27 73)" fill="#FAFAFA" />
      <rect x="23" y="23" width="8" height="8" rx="1.5" transform="rotate(45 27 27)" fill="#FAFAFA" />
      <circle cx="50" cy="50" r="17" fill="#FAFAFA" />
      <circle cx="50" cy="50" r="11" fill="#000000" />
      <circle cx="50" cy="50" r="6" fill="#FAFAFA" />
      <circle cx="50" cy="50" r="2.2" fill="#000000" />
    </svg>
  );
}

function EmailForm({ label = '[ JOIN WAITLIST ]', source = 'hero' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok || res.status === 409) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-zinc-800 text-zinc-300 text-sm px-6 py-4 text-center">
        You&apos;re on the list. We&apos;ll reach out when your slot opens.
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="your@email.com"
          className="flex-1 bg-black border border-zinc-800 text-white text-sm px-4 py-3 outline-none focus:border-zinc-500 placeholder:text-zinc-600 sm:border-r-0 transition-colors duration-150"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black text-xs font-bold px-6 py-3 hover:bg-zinc-100 active:bg-zinc-200 transition-colors duration-150 whitespace-nowrap disabled:opacity-60 border border-white"
        >
          {loading ? 'JOINING...' : label}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}

function ShowcaseCard() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const run = () => {
    if (running || step > 0) return;
    setRunning(true);
    setTimeout(() => setStep(1), 700);
    setTimeout(() => setStep(2), 1700);
    setTimeout(() => { setStep(3); setRunning(false); }, 2700);
  };

  return (
    <div>
      {/* Card */}
      <div className="border border-zinc-800">
        {/* Card header */}
        <div className="border-b border-zinc-800 px-5 py-3 flex items-center justify-between bg-zinc-950">
          <span className="text-xs text-zinc-500 tracking-widest">CONNECTED ACCOUNT</span>
          <span className="text-xs text-green-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            LIVE
          </span>
        </div>

        {/* Row 1: Balance — static */}
        <div className="px-5 py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm">🏦 CHASE CHECKING ACCOUNT</span>
          <span className="text-sm font-bold">BALANCE: $12,450.00</span>
        </div>

        {/* Row 2: Adobe */}
        <div
          className="px-5 py-4 border-b border-zinc-800 transition-colors duration-700"
          style={{ background: step >= 1 ? 'rgba(20,83,45,0.25)' : 'transparent' }}
        >
          <div className="relative min-h-[22px]">
            <span
              className="block text-sm text-amber-400 absolute inset-0 transition-opacity duration-500"
              style={{ opacity: step >= 1 ? 0 : 1 }}
            >
              ⚠️ Flagged: Unused Adobe subscription draining $54.99/mo
            </span>
            <span
              className="block text-sm text-green-400 absolute inset-0 transition-opacity duration-500"
              style={{ opacity: step >= 1 ? 1 : 0 }}
            >
              ✅ Adobe Account Cancelled → Saving $659.88/year
            </span>
          </div>
        </div>

        {/* Row 3: Interest / treasury */}
        <div
          className="px-5 py-4 border-b border-zinc-800 transition-colors duration-700"
          style={{ background: step >= 2 ? 'rgba(23,37,84,0.4)' : 'transparent' }}
        >
          <div className="relative min-h-[22px]">
            <span
              className="block text-sm text-zinc-400 absolute inset-0 transition-opacity duration-500"
              style={{ opacity: step >= 2 ? 0 : 1 }}
            >
              📉 Balance Drag: Earning 0.01% interest ($1.24/year)
            </span>
            <span
              className="block text-sm text-blue-400 absolute inset-0 transition-opacity duration-500"
              style={{ opacity: step >= 2 ? 1 : 0 }}
            >
              ⚡ Excess Liquidity Routed to Treasury Node → Earning 5.15% APY
            </span>
          </div>
        </div>

        {/* Row 4: Net worth calc */}
        <div
          className="px-5 transition-all duration-700 overflow-hidden"
          style={{
            maxHeight: step >= 3 ? '120px' : '0px',
            opacity: step >= 3 ? 1 : 0,
            paddingTop: step >= 3 ? '20px' : '0',
            paddingBottom: step >= 3 ? '20px' : '0',
          }}
        >
          <div className="border border-green-900 bg-green-950/40 px-4 py-4 flex flex-wrap items-baseline gap-2 justify-center text-center">
            <span className="text-green-400 font-bold text-2xl">+ $1,142.00</span>
            <span className="text-green-600 text-sm">Added to Annual Net Worth</span>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={run}
        disabled={running || step > 0}
        className="mt-5 w-full py-4 text-sm font-bold tracking-wider border transition-colors duration-150"
        style={{
          borderColor: step > 0 ? '#27272A' : '#FAFAFA',
          color: step > 0 ? '#52525B' : '#FAFAFA',
          background: 'transparent',
          cursor: running || step > 0 ? 'default' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (step === 0 && !running) {
            e.currentTarget.style.background = '#FAFAFA';
            e.currentTarget.style.color = '#000';
          }
        }}
        onMouseLeave={(e) => {
          if (step === 0 && !running) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#FAFAFA';
          }
        }}
      >
        {step === 0
          ? running
            ? 'OPTIMIZING...'
            : '[ RUN AUTOMATED OPTIMIZATION ]'
          : '[ OPTIMIZATION COMPLETE ]'}
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-mono">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-900 flex items-center justify-between px-6 md:px-12 h-14">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <LucaLogo size={22} />
          <span className="text-white font-bold text-base tracking-tight">LUCA</span>
        </a>
        <a
          href="#waitlist"
          className="border border-zinc-700 text-zinc-300 text-xs px-4 py-2 hover:border-white hover:text-white transition-colors duration-150"
        >
          [ CLAIM ACCESS ]
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32 flex flex-col items-center text-center">
        <div className="max-w-2xl w-full">

          {/* Badge */}
          <div className="inline-block border border-zinc-800 text-zinc-500 text-xs px-3 py-1 mb-10 tracking-widest">
            EARLY ACCESS — ALPHA COHORT OPEN
          </div>

          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <LucaLogo size={56} />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2] mb-6">
            Your Automated CFO.<br />
            Put your personal finances<br className="hidden sm:block" /> on autopilot.
          </h1>

          {/* Sub */}
          <p className="text-base text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
            Luca links securely to your existing bank accounts to instantly find and cancel
            forgotten subscriptions, recover hidden fees, and route your idle checking balance
            into high-yield spaces automatically.
          </p>

          {/* Form */}
          <div id="waitlist" className="max-w-md mx-auto">
            <EmailForm label="[ JOIN WAITLIST ]" source="hero" />
            <p className="text-zinc-600 text-xs mt-4">
              No credit card required. Read-only bank access. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────── */}
      <div className="border-t border-zinc-900" />

      {/* ── INTERACTIVE SHOWCASE ────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          <p className="text-zinc-500 text-xs tracking-widest mb-3 text-center md:text-left">
            INTERACTIVE DEMO
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-center md:text-left">
            See how Luca optimizes a standard bank account with one tap.
          </h2>
          <p className="text-zinc-400 text-sm mb-10 text-center md:text-left">
            Click the button below to watch a live simulation of what Luca does to your accounts.
          </p>
          <ShowcaseCard />
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────── */}
      <div className="border-t border-zinc-900" />

      {/* ── BENEFITS ────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-500 text-xs tracking-widest mb-3">WHAT LUCA DOES</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-16">
            Three things that make you richer, automatically.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
            {/* Col 1 */}
            <div className="pb-12 md:pb-0 md:pr-10">
              <div className="text-3xl mb-5">🚫</div>
              <h3 className="font-bold text-white text-lg mb-3 tracking-tight">
                Cancel Forgotten Leaks
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Luca automatically logs in and terminates the subscriptions you stop using,
                before another billing cycle hits your account.
              </p>
            </div>
            {/* Col 2 */}
            <div className="py-12 md:py-0 md:px-10">
              <div className="text-3xl mb-5">⚡</div>
              <h3 className="font-bold text-white text-lg mb-3 tracking-tight">
                Maximize Cash Yield
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Keeps your bill money secure while moving lazy checking balances into
                high-yield nodes earning 5x more overnight.
              </p>
            </div>
            {/* Col 3 */}
            <div className="pt-12 md:pt-0 md:pl-10">
              <div className="text-3xl mb-5">🛡️</div>
              <h3 className="font-bold text-white text-lg mb-3 tracking-tight">
                Reverse Bank Fees
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Identifies predatory maintenance charges and files automated waiver disputes
                on your behalf, typically resolved within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────── */}
      <div className="border-t border-zinc-900" />

      {/* ── FOOTER CTA ──────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 md:py-32 text-center">
        <div className="max-w-md mx-auto">
          <LucaLogo size={40} />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-8 mb-4">
            Ready to stop leaving money on the table?
          </h2>
          <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
            Join the Luca waitlist. First cohort gets locked-in founder pricing.
          </p>
          <EmailForm label="[ JOIN WAITLIST ]" source="footer" />
          <p className="text-zinc-600 text-xs mt-4">
            No credit card required. Read-only bank access. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <LucaLogo size={16} />
          <span className="text-zinc-600 text-xs">LUCA — meet-luca.com</span>
        </div>
        <span className="text-zinc-700 text-xs">© 2025 Luca. All rights reserved.</span>
      </footer>

    </main>
  );
}
