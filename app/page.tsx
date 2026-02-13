'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

type Project = {
  id: string;
  title: string;
  tag: 'Architecture' | 'FinTech' | 'Systems';
  blurb: string;
  metric: string;
};

const projects: Project[] = [
  { id: 'p1', title: 'Zurich Skyline Digital Twin', tag: 'Architecture', blurb: 'Real-time facade and occupancy diagnostics.', metric: '+38% planning precision' },
  { id: 'p2', title: 'Liquidity Risk Lens', tag: 'FinTech', blurb: 'Cross-market anomaly mapping at millisecond intervals.', metric: '99.98% event capture' },
  { id: 'p3', title: 'Carbon Envelope Index', tag: 'Systems', blurb: 'Portfolio-level emissions simulation and projection.', metric: '-22% projected waste' },
  { id: 'p4', title: 'Adaptive Treasury Mesh', tag: 'FinTech', blurb: 'Behavioral routing for institutional cash operations.', metric: '$1.2B routed daily' },
  { id: 'p5', title: 'Parametric Habitat Engine', tag: 'Architecture', blurb: 'Interactive prototypes for modular urban builds.', metric: '4.3x design velocity' },
  { id: 'p6', title: 'Signal Integrity Rail', tag: 'Systems', blurb: 'Data governance pipelines with audit-grade lineage.', metric: 'Zero compliance drift' }
];

const navItems = ['Overview', 'Process', 'Portfolio', 'Dashboard', 'Contact'];
const commandActions = ['Open Portfolio Filters', 'Jump to Dashboard', 'Toggle Live Ticker', 'View System Health'];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | Project['tag']>('All');
  const [activeCard, setActiveCard] = useState<string | null>(projects[0].id);
  const [ticker, setTicker] = useState({ latency: 23, throughput: 1240, uptime: 99.998 });
  const [clock, setClock] = useState('');
  const [cursor, setCursor] = useState({ x: 0, y: 0, variant: 'default' as 'default' | 'project' });
  const shouldReduceMotion = useReducedMotion();
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent) => setCursor((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      setClock(new Intl.DateTimeFormat('en-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Zurich' }).format(new Date()));
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const tickerTimer = window.setInterval(() => {
      setTicker({
        latency: Number((20 + Math.random() * 6).toFixed(1)),
        throughput: Math.round(1180 + Math.random() * 90),
        uptime: Number((99.99 + Math.random() * 0.009).toFixed(3))
      });
    }, 1800);
    return () => window.clearInterval(tickerTimer);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let current = window.scrollY;
    let target = window.scrollY;

    const syncHeight = () => {
      if (contentRef.current && scrollWrapRef.current) {
        document.body.style.height = `${contentRef.current.getBoundingClientRect().height}px`;
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      setScrollY(target);
    };

    const raf = () => {
      current += (target - current) * 0.09;
      if (scrollWrapRef.current) {
        scrollWrapRef.current.style.transform = `translate3d(0, ${-current}px, 0)`;
      }
      requestAnimationFrame(raf);
    };

    syncHeight();
    window.addEventListener('resize', syncHeight);
    window.addEventListener('scroll', onScroll);
    requestAnimationFrame(raf);

    return () => {
      document.body.style.height = 'auto';
      window.removeEventListener('resize', syncHeight);
      window.removeEventListener('scroll', onScroll);
    };
  }, [shouldReduceMotion]);

  const filteredProjects = useMemo(
    () => (activeFilter === 'All' ? projects : projects.filter((project) => project.tag === activeFilter)),
    [activeFilter]
  );

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[100] hidden rounded-full mix-blend-difference md:block"
        animate={{
          x: cursor.x - (cursor.variant === 'project' ? 24 : 8),
          y: cursor.y - (cursor.variant === 'project' ? 24 : 8),
          width: cursor.variant === 'project' ? 48 : 16,
          height: cursor.variant === 'project' ? 48 : 16,
          backgroundColor: cursor.variant === 'project' ? '#0f2b8c' : '#1D1D1F'
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.35 }}
      />

      <div
        className={`${shouldReduceMotion ? 'relative' : 'fixed left-0 top-0'} z-[1] w-full`}
        ref={scrollWrapRef}
        style={shouldReduceMotion ? { transform: 'none' } : undefined}
      >
        <div ref={contentRef}>
          <header className={`fixed left-1/2 top-5 z-50 w-[min(94%,980px)] -translate-x-1/2 rounded-xl border border-black/10 glass shadow-glass transition-all ${scrollY > 60 ? 'py-2' : 'py-4'}`}>
            <nav className="mx-auto flex items-center justify-between px-4 md:px-8" aria-label="Primary">
              <p className="text-sm tracking-[0.2em]">AXIOM ATELIER</p>
              <ul className="hidden gap-5 text-xs uppercase tracking-[0.18em] md:flex">
                {navItems.map((item) => (
                  <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>
                ))}
              </ul>
              <button
                aria-label="Open command palette"
                onClick={() => setCommandOpen(true)}
                className="rounded-md border border-black/15 px-3 py-1 text-xs"
              >
                Cmd+K
              </button>
            </nav>
          </header>

          <main className="bg-base px-4 pb-20 pt-36 md:px-10">
            <section id="overview" className="grid-shell min-h-[88vh] items-end pb-10">
              <div className="col-span-12 md:col-span-8">
                <motion.p className="section-label mb-6" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Strategic Spatial Intelligence</motion.p>
                <motion.h1
                  className="text-[clamp(2.8rem,9vw,7.5rem)] font-light leading-[0.88] tracking-[-0.04em]"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Precision architecture for digital systems and modern capital.
                </motion.h1>
              </div>
              <motion.div
                className="col-span-12 mt-8 overflow-hidden rounded-lg border border-black/10 md:col-span-4 md:mt-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <video autoPlay loop muted playsInline className="h-full min-h-60 w-full object-cover opacity-70" aria-label="Ambient abstract backdrop">
                  <source src="https://cdn.coverr.co/videos/coverr-digital-thinking-1579/1080p.mp4" type="video/mp4" />
                </video>
              </motion.div>
            </section>

            <section id="process" className="py-20">
              <div className="hairline mb-8" />
              <p className="section-label mb-5">The Core · Horizontal Process</p>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                {['Audit', 'Model', 'Stress Test', 'Deploy'].map((step, idx) => (
                  <motion.article
                    key={step}
                    className="min-h-72 min-w-[280px] snap-start rounded-lg border border-black/10 bg-muted p-6 md:min-w-[420px]"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <p className="section-label">0{idx + 1}</p>
                    <h2 className="mt-5 text-3xl font-light">{step}</h2>
                    <p className="mt-3 max-w-sm text-sm text-black/70">Swiss-structured workflows with deterministic checkpoints and measurable output integrity.</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <section id="portfolio" className="py-20">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <p className="section-label">Interactive Portfolio Grid</p>
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Portfolio filters">
                  {(['All', 'Architecture', 'FinTech', 'Systems'] as const).map((filter) => (
                    <button
                      key={filter}
                      role="tab"
                      aria-selected={activeFilter === filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-md border px-3 py-1 text-xs uppercase tracking-[0.16em] transition ${activeFilter === filter ? 'border-accent bg-accent text-white' : 'border-black/15'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => {
                  const expanded = activeCard === project.id;
                  return (
                    <motion.button
                      key={project.id}
                      layout
                      onMouseEnter={() => setCursor((prev) => ({ ...prev, variant: 'project' }))}
                      onMouseLeave={() => setCursor((prev) => ({ ...prev, variant: 'default' }))}
                      onClick={() => setActiveCard(expanded ? null : project.id)}
                      className={`rounded-lg border border-black/10 bg-muted p-5 text-left transition focus-visible:outline-accent ${expanded ? 'ring-1 ring-accent' : ''}`}
                    >
                      <p className="section-label">{project.tag}</p>
                      <h3 className="mt-3 text-xl font-medium">{project.title}</h3>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <p className="mt-4 text-sm text-black/70">{project.blurb}</p>
                            <p className="mt-4 text-sm font-medium text-accent">{project.metric}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <section id="dashboard" className="py-20">
              <p className="section-label mb-6">Client Portal / Live Systems</p>
              <div className="grid gap-4 md:grid-cols-6">
                <div className="rounded-lg border border-black/10 bg-muted p-5 md:col-span-2">
                  <p className="section-label">Latency</p>
                  <p className="mt-3 text-4xl font-light">{ticker.latency}ms</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-muted p-5 md:col-span-2">
                  <p className="section-label">Throughput</p>
                  <p className="mt-3 text-4xl font-light">{ticker.throughput}</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-muted p-5 md:col-span-2">
                  <p className="section-label">Uptime</p>
                  <p className="mt-3 text-4xl font-light">{ticker.uptime}%</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-white p-5 md:col-span-4">
                  <p className="section-label mb-4">Exposure Bands</p>
                  <div className="flex h-32 items-end gap-2">
                    {[42, 70, 56, 88, 62, 76, 90, 68].map((value, idx) => (
                      <motion.div key={idx} className="w-full rounded-sm bg-accent/80" initial={{ height: 0 }} whileInView={{ height: `${value}%` }} viewport={{ once: true }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-black/10 bg-white p-5 md:col-span-2">
                  <p className="section-label">System Status</p>
                  <p className="mt-4 text-sm">All nodes synchronized · no packet anomalies detected.</p>
                  <span className="mt-4 inline-block rounded bg-accent px-2 py-1 text-xs text-white">Live</span>
                </div>
              </div>
            </section>
          </main>

          <footer id="contact" className="border-t border-black/10 bg-muted px-4 py-14 md:px-10">
            <div className="grid gap-10 md:grid-cols-4">
              <div>
                <p className="section-label">Axiom Atelier</p>
                <p className="mt-4 max-w-xs text-sm text-black/70">Designing calibrated digital systems for ambitious operators.</p>
              </div>
              <div>
                <p className="section-label">Navigate</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {navItems.map((item) => (
                    <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="section-label">Newsletter</p>
                <form className="mt-4 flex gap-2" aria-label="Newsletter signup">
                  <input aria-label="Email address" type="email" placeholder="you@company.com" className="w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm" />
                  <button className="rounded-md bg-accent px-4 py-2 text-sm text-white active:scale-95">Join</button>
                </form>
              </div>
              <div>
                <p className="section-label">Local Clock</p>
                <p className="mt-4 text-3xl font-light" aria-live="polite">{clock || '--:--:--'}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/60">Europe/Zurich</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {commandOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/30 px-4 pt-28"
          >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="glass w-full max-w-xl rounded-xl border border-white/30 p-3 shadow-glass">
              <input
                autoFocus
                aria-label="Search commands"
                placeholder="Type a command..."
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm"
              />
              <ul className="mt-3 space-y-1">
                {commandActions.map((action) => (
                  <li key={action}>
                    <button onClick={() => setCommandOpen(false)} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-white/70">
                      {action}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
