'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── Design tokens ───────────────────────────────────────────────────────────
const BG       = '#0A0A0A';
const TEXT      = '#F5F5F3';
const DIM       = 'rgba(245,245,243,0.4)';
const DIMMER    = 'rgba(245,245,243,0.25)';
const DIMMEST   = 'rgba(245,245,243,0.12)';
const BORDER    = 'rgba(245,245,243,0.09)';

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEED = [
  { action: 'Canceled 3 subscriptions',       result: '+ $78 / mo saved'   },
  { action: 'Moved $2,400 → 4.6% HYSA',       result: 'Done'               },
  { action: 'Disputed overdraft fee',          result: 'In progress'        },
  { action: 'Switched to SAVE loan plan',      result: '− $214 / mo'        },
  { action: 'Adjusted tax withholding',        result: 'Review ready'       },
  { action: 'Found 2 duplicate charges',       result: '+ $29 recovered'    },
  { action: 'Negotiating Comcast bill',        result: 'Active'             },
  { action: 'Flagged suspicious charge',       result: 'Investigating'      },
];

const COMMANDS = [
  'cancel my gym membership...',
  'find hidden fees from the last 90 days...',
  'where should I park my $3k right now...',
  'am I overpaying on my student loans...',
  'dispute my last overdraft fee...',
];

// ─── Luca logo mark ───────────────────────────────────────────────────────────
function Logo({ size = 22 }) {
  const c = TEXT;
  const bg = BG;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <rect x="46" y="14" width="8" height="8" rx="1.5" fill={c} />
      <rect x="78" y="46" width="8" height="8" rx="1.5" fill={c} />
      <rect x="46" y="78" width="8" height="8" rx="1.5" fill={c} />
      <rect x="14" y="46" width="8" height="8" rx="1.5" fill={c} />
      <rect x="69" y="23" width="8" height="8" rx="1.5" transform="rotate(45 73 27)" fill={c} />
      <rect x="69" y="69" width="8" height="8" rx="1.5" transform="rotate(45 73 73)" fill={c} />
      <rect x="23" y="69" width="8" height="8" rx="1.5" transform="rotate(45 27 73)" fill={c} />
      <rect x="23" y="23" width="8" height="8" rx="1.5" transform="rotate(45 27 27)" fill={c} />
      <circle cx="50" cy="50" r="17" fill={c} />
      <circle cx="50" cy="50" r="11" fill={bg} />
      <circle cx="50" cy="50" r="6"  fill={c} />
      <circle cx="50" cy="50" r="2.2" fill={bg} />
    </svg>
  );
}

// ─── Node canvas (hero background) ───────────────────────────────────────────
function NodeCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const fit = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const nodes = Array.from({ length: 42 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r:  Math.random() * 1.2 + 0.4,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height)  n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(245,245,243,${(1 - d / 180) * 0.055})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245,245,243,0.09)';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'blur(0.8px)' }}
    />
  );
}

// ─── Email form ───────────────────────────────────────────────────────────────
function HeroForm() {
  const [email,   setEmail]   = useState('');
  const [state,   setState]   = useState('idle'); // idle | loading | success | duplicate | error
  const [position, setPosition] = useState(0);
  const [displayed, setDisplayed] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    if (state !== 'idle') return;
    setState('loading');

    try {
      const ins = await fetch(`${SUPA_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ email }),
      });

      if (ins.status === 409) { setState('duplicate'); return; }
      if (!ins.ok)             { setState('error');     return; }

      // Fetch row count for position
      let pos = 4848;
      try {
        const cnt = await fetch(
          `${SUPA_URL}/rest/v1/waitlist?select=id&limit=1`,
          {
            headers: {
              apikey: SUPA_KEY,
              Authorization: `Bearer ${SUPA_KEY}`,
              Prefer: 'count=exact',
              Range: '0-0',
            },
          }
        );
        const cr = cnt.headers.get('content-range') || '';
        const m  = cr.match(/\/(\d+)$/);
        if (m) pos = parseInt(m[1], 10);
      } catch { /* use default */ }

      setPosition(pos);
      setState('success');

      // Count-up animation
      const start = performance.now();
      const dur   = 1400;
      const tick  = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setDisplayed(Math.round(e * pos));
        if (p < 1) requestAnimationFrame(tick);
        else setDisplayed(pos);
      };
      requestAnimationFrame(tick);
    } catch {
      setState('error');
    }
  };

  if (state === 'duplicate') {
    return (
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="font-mono text-sm" style={{ color: DIM }}
      >
        Luca already has you.
      </motion.p>
    );
  }
  if (state === 'error') {
    return (
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="font-mono text-sm" style={{ color: DIM }}
      >
        Something went wrong. Try again.
      </motion.p>
    );
  }
  if (state === 'success') {
    return (
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-sm" style={{ color: TEXT }}
      >
        You&apos;re #{displayed.toLocaleString()}. Luca is already on it.
      </motion.p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-0 max-w-[460px]">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={state === 'loading'}
        className="flex-1 bg-transparent font-mono font-light text-sm py-3 outline-none placeholder:opacity-30"
        style={{
          color: TEXT,
          borderBottom: `1px solid ${DIMMER}`,
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          minWidth: 0,
        }}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="sm:ml-8 mt-5 sm:mt-0 px-7 py-3 font-serif italic text-sm shrink-0 transition-opacity duration-150 disabled:opacity-50"
        style={{ background: TEXT, color: BG }}
      >
        {state === 'loading' ? 'Joining...' : 'Join the waitlist →'}
      </button>
    </form>
  );
}

// ─── Live agent feed ──────────────────────────────────────────────────────────
function AgentFeed() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FEED.length), 2500);
    return () => clearInterval(t);
  }, []);

  const item = FEED[idx];
  const ts   = new Date().toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-8"
           style={{ color: DIMMEST }}>
          // luca is working right now
        </p>

        <div className="border" style={{ borderColor: BORDER, background: '#060606' }}>
          {/* Terminal header */}
          <div className="flex items-center justify-between px-6 py-3 border-b"
               style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: DIMMEST }}>
                AGENT ACTIVITY LOG
              </span>
            </div>
            <span className="font-mono text-[10px] flex items-center gap-1.5"
                  style={{ color: 'rgba(245,245,243,0.18)' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
              LIVE
            </span>
          </div>

          {/* Active row */}
          <div className="px-6 md:px-10 py-10 md:py-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8"
              >
                <span className="font-mono text-xs shrink-0" style={{ color: DIMMEST }}>
                  {ts}
                </span>
                <span className="font-serif font-bold text-2xl md:text-3xl flex-1 sm:text-center"
                      style={{ color: TEXT, letterSpacing: '-0.02em' }}>
                  {item.action}
                </span>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase shrink-0 self-start sm:self-auto border px-3 py-1.5"
                  style={{ borderColor: DIMMER, color: DIM }}
                >
                  {item.result}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress pips */}
          <div className="flex items-center gap-1.5 px-6 pb-5 justify-center">
            {FEED.map((_, i) => (
              <div
                key={i}
                className="h-px transition-all duration-300"
                style={{
                  width: i === idx ? '28px' : '8px',
                  background: i === idx ? DIMMER : DIMMEST,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { value: '$847', label: 'Average saved per month' },
    { value: '11s',  label: 'Time to first insight'   },
    { value: '94%',  label: 'Fee dispute win rate'     },
  ];

  return (
    <section ref={ref} style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: i * 0.1 }}
            className="px-8 md:px-14 py-16 md:py-20 text-center"
            style={{
              borderRight:  i < 2 ? `1px solid ${BORDER}` : 'none',
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div
              className="font-serif font-black tracking-tight mb-3"
              style={{ fontSize: 'clamp(64px, 8vw, 88px)', color: TEXT, lineHeight: 1 }}
            >
              {s.value}
            </div>
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase"
                 style={{ color: DIM }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Trust ─────────────────────────────────────────────────────────────────────
function Trust() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const items = [
    'Bank-level 256-bit encryption. Your credentials are never stored.',
    'Read-only by default. Luca asks before it acts.',
    'No upsells. No ads. Luca works for you, not banks.',
  ];

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="font-serif font-black mb-14"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: TEXT, letterSpacing: '-0.025em' }}
        >
          Built for the 99%.
        </motion.h2>

        <div>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
              className="py-5 pl-5"
              style={{
                borderLeft:   `1px solid ${DIMMER}`,
                borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : 'none',
              }}
            >
              <p className="font-mono font-light text-sm leading-relaxed max-w-lg"
                 style={{ color: DIM }}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Command bar ──────────────────────────────────────────────────────────────
function CommandBar() {
  const [text, setText] = useState('');
  const state = useRef({ ci: 0, cmd: 0, phase: 'typing' });

  useEffect(() => {
    let t;
    const tick = () => {
      const { ci, cmd, phase } = state.current;
      const cur = COMMANDS[cmd];

      if (phase === 'typing') {
        if (ci < cur.length) {
          state.current.ci++;
          setText(cur.slice(0, state.current.ci));
          t = setTimeout(tick, 38 + Math.random() * 55);
        } else {
          state.current.phase = 'hold';
          t = setTimeout(tick, 1900);
        }
      } else if (phase === 'hold') {
        state.current.phase = 'deleting';
        t = setTimeout(tick, 300);
      } else {
        if (ci > 0) {
          state.current.ci--;
          setText(cur.slice(0, state.current.ci));
          t = setTimeout(tick, 16);
        } else {
          state.current.cmd   = (cmd + 1) % COMMANDS.length;
          state.current.phase = 'typing';
          t = setTimeout(tick, 240);
        }
      }
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase mb-6"
           style={{ color: DIMMEST }}>
          // ask luca anything
        </p>

        <div
          className="flex items-center justify-between gap-4 px-5 md:px-7 py-5 border"
          style={{ borderColor: BORDER, background: '#060606' }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="font-mono text-base shrink-0" style={{ color: DIMMEST }}>❯</span>
            <span className="font-mono text-sm md:text-base" style={{ color: DIM }}>
              {text}
              <span
                className="inline-block align-middle ml-px"
                style={{
                  width: '2px',
                  height: '1em',
                  background: DIMMER,
                  animation: 'cursor-blink 1s step-end infinite',
                }}
              />
            </span>
          </div>
          <span
            className="font-mono text-[11px] shrink-0 border px-2 py-1"
            style={{ borderColor: BORDER, color: DIMMEST }}
          >
            ⌘K
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const stagger = (i) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: i * 0.1 },
  });

  return (
    <main className="min-h-screen" style={{ background: BG, color: TEXT }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-[52px]"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <Logo size={20} />
          <span className="font-serif font-bold text-lg tracking-tight" style={{ color: TEXT }}>
            Luca
          </span>
        </a>
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase"
              style={{ color: DIMMEST }}>
          4,847 people waiting
        </span>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 py-24 overflow-hidden">
        <NodeCanvas />
        {/* radial vignette to bleed canvas into page bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              `radial-gradient(ellipse 80% 70% at 60% 50%, transparent 20%, ${BG} 75%)`,
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <motion.p {...stagger(0)}
            className="font-mono text-[10px] tracking-[0.25em] uppercase mb-10"
            style={{ color: DIMMEST }}
          >
            // The autonomous financial agent
          </motion.p>

          <motion.h1 {...stagger(1)}
            className="font-serif font-black leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: 'clamp(68px, 10vw, 110px)', color: TEXT }}
          >
            Your money,<br />handled.
          </motion.h1>

          <motion.p {...stagger(2)}
            className="font-mono font-light text-sm md:text-[15px] leading-[1.75] mb-12 max-w-[460px]"
            style={{ color: DIM }}
          >
            Luca works in the background. Canceling subscriptions, disputing fees,
            moving your cash, optimizing your debt. No spreadsheets. No advisors.
            Just results.
          </motion.p>

          <motion.div {...stagger(3)}>
            <HeroForm />
            <p className="font-mono text-[10px] mt-5" style={{ color: DIMMEST }}>
              No credit card. Read-only access by default.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── LIVE FEED ────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <AgentFeed />
      </div>

      {/* ── STATS ────────────────────────────────────────────── */}
      <Stats />

      {/* ── TRUST ─────────────────────────────────────────────── */}
      <Trust />

      {/* ── COMMAND BAR ──────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <CommandBar />
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        className="flex flex-wrap items-center justify-between px-6 md:px-12 py-6 gap-4"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2.5">
          <Logo size={14} />
          <span className="font-serif font-bold text-sm" style={{ color: TEXT }}>Luca</span>
        </div>
        <span className="font-mono text-[10px]" style={{ color: DIMMEST }}>
          © 2025 Luca. All rights reserved.
        </span>
      </footer>

    </main>
  );
}
