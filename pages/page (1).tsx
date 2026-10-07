'use client';

/**
 * RUNASH SONS OF INDUSTRIES — MSME (Udyam-JH-01-0009732)
 * ---------------------------------------------------------------
 * Aesthetic direction: hard-tech / industrial-blueprint.
 * Graphite base, hazard-orange signal color, schematic line art,
 * spec-sheet typography (IBM Plex Mono for data, Big Shoulders for
 * display headlines). Motion is used sparingly but deliberately:
 * one staggered hero reveal, a scrolling capability ticker, an
 * animated production line, and gauge-style metrics that sweep in
 * on scroll.
 *
 * ⚠️ MOCK DATA: figures, sectors, contact details, and registration
 * numbers below are realistic placeholders, not Runash's real data.
 * Swap in actual numbers before shipping — nothing here is a live
 * source of truth.
 *
 * Fonts are loaded via next/font/google — no external <link> tags
 * needed. This file assumes Tailwind CSS is configured in the
 * project (standard for create-next-app). styled-jsx (used for the
 * marquee + grain texture) ships with Next.js by default.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { IBM_Plex_Mono, Big_Shoulders_Display, IBM_Plex_Sans } from 'next/font/google';
import {
  Factory,
  Flame,
  Cog,
  Ruler,
  ShieldCheck,
  Truck,
  Hammer,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  BadgeCheck,
  Boxes,
} from 'lucide-react';

const display = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});
const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

// ---------------------------------------------------------------
// DATA — TODO: replace with Runash's real specs
// ---------------------------------------------------------------

const STATS = [
  { label: 'Years in operation', value: 30, suffix: '+', unit: 'YRS' },
  { label: 'Annual casting capacity', value: 12000, suffix: '', unit: 'MT/YR' },
  { label: 'Machining tolerance', value: 0.02, suffix: '', unit: 'MM', decimals: 2 },
  { label: 'Generations of engineers', value: 3, suffix: '', unit: 'GEN' },
];

const CAPABILITIES = [
  {
    code: '01',
    title: 'Foundry & Casting',
    icon: Flame,
    desc: 'Grey iron, ductile iron & steel castings from pattern to finish, melted and poured in-house.',
    specs: ['Batch: 5 kg – 2,000 kg', 'Materials: GI / SG / Carbon steel', 'Induction furnace melting'],
  },
  {
    code: '02',
    title: 'CNC Precision Machining',
    icon: Cog,
    desc: 'Multi-axis turning and milling for tight-tolerance components at production volume.',
    specs: ['Tolerance: ±0.02 mm', '3 / 4 / 5-axis capability', 'In-process CMM inspection'],
  },
  {
    code: '03',
    title: 'Fabrication & Welding',
    icon: Hammer,
    desc: 'Structural steel fabrication, MIG/TIG/ARC welding, and heavy assembly for plant equipment.',
    specs: ['Plate up to 40 mm', 'Certified welding procedures', 'On-site erection support'],
  },
  {
    code: '04',
    title: 'Industrial Equipment Mfg.',
    icon: Factory,
    desc: 'Custom-built spares and equipment for steel, mining, and material-handling plants.',
    specs: ['Conveyor & crusher spares', 'Wear-resistant liners', 'Reverse-engineered OEM parts'],
  },
  {
    code: '05',
    title: 'Quality & Compliance',
    icon: ShieldCheck,
    desc: 'Dimensional and material verification against drawing and customer PPAP requirements.',
    specs: ['Spectrometer material check', 'Hardness & UT testing', 'Full traceability per lot'],
  },
  {
    code: '06',
    title: 'Logistics & Dispatch',
    icon: Truck,
    desc: 'Palletised, export-ready dispatch across Jharkhand and pan-India rail/road corridors.',
    specs: ['PAN-India dispatch', 'Export packing on request', 'Batch-wise dispatch docs'],
  },
];

const PROCESS_STEPS = [
  { label: 'Raw Material', icon: Boxes, note: 'Pig iron, scrap & alloy intake, spectro-checked on arrival.' },
  { label: 'Melting & Casting', icon: Flame, note: 'Induction melting, sand/shell moulding, controlled pour.' },
  { label: 'Machining', icon: Cog, note: 'CNC turning/milling to drawing tolerance.' },
  { label: 'Inspection', icon: Ruler, note: 'Dimensional, hardness & material verification.' },
  { label: 'Dispatch', icon: Truck, note: 'Packing, documentation, and outbound logistics.' },
];

const SECTORS = [
  'Steel & Mining',
  'Railways',
  'Automotive OEM',
  'Power & Energy',
  'Infrastructure & Cement',
];

const TICKER_ITEMS = [
  'UDYAM-JH-01-0009732',
  'GREY IRON · DUCTILE IRON · CARBON STEEL',
  '±0.02mm CNC TOLERANCE',
  '12,000 MT/YR FOUNDRY CAPACITY',
  'EST. THREE GENERATIONS',
  'RANCHI INDUSTRIAL BELT · JHARKHAND',
];

// ---------------------------------------------------------------
// SMALL UTILITIES
// ---------------------------------------------------------------

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs tracking-[0.3em] text-[color:var(--orange)]">
        {index}
      </span>
      <span className="h-px flex-1 bg-white/10" />
      <h2 className="font-display uppercase tracking-tight text-3xl md:text-4xl text-white">
        {title}
      </h2>
    </div>
  );
}

function AnimatedNumber({
  value,
  decimals = 0,
  duration = 1.4,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-IN')}
    </span>
  );
}

function GaugeRing({ percent, size = 120 }: { percent: number; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref} style={{ width: size, height: size }} className="relative shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={8}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ff5a1f"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference * (1 - percent / 100) } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-lg text-white">
        {percent}%
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const [navSolid, setNavSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main
      className={`${display.variable} ${mono.variable} ${sans.variable} relative min-h-screen bg-[#0b0d0e] text-white overflow-x-clip`}
      style={
        {
          '--orange': '#ff5a1f',
          '--yellow': '#ffc400',
          '--steel': '#8b98a5',
          fontFamily: 'var(--font-sans)',
        } as React.CSSProperties
      }
    >
      {/* grain + blueprint grid backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-[0.06]" />
      <div className="pointer-events-none fixed inset-0 z-0 grain-overlay opacity-[0.05]" />

      {/* ----------------------------------------------------- NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
          navSolid ? 'bg-[#0b0d0e]/90 backdrop-blur border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display uppercase tracking-tight text-lg">
            <span className="inline-block h-2 w-2 bg-[color:var(--orange)]" />
            Runash <span className="text-[color:var(--steel)]">Sons of Industries</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.2em] text-white/60">
            <a href="#capabilities" className="hover:text-white transition-colors">CAPABILITIES</a>
            <a href="#process" className="hover:text-white transition-colors">PROCESS</a>
            <a href="#sectors" className="hover:text-white transition-colors">SECTORS</a>
            <a href="#compliance" className="hover:text-white transition-colors">COMPLIANCE</a>
            <a
              href="#rfq"
              className="px-4 py-2 border border-[color:var(--orange)] text-[color:var(--orange)] hover:bg-[color:var(--orange)] hover:text-black transition-colors"
            >
              REQUEST QUOTE
            </a>
          </nav>
        </div>
      </header>

      {/* ----------------------------------------------------- HERO */}
      <section ref={heroRef} className="relative z-10 min-h-[100svh] flex flex-col justify-center px-6 md:px-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="mx-auto max-w-7xl w-full pt-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-[color:var(--orange)] mb-6"
          >
            <BadgeCheck className="h-4 w-4" />
            UDYAM-JH-01-0009732 · MSME REGISTERED
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.85] tracking-tight text-[13vw] md:text-[7.5rem]"
            >
              Cast.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.85] tracking-tight text-[13vw] md:text-[7.5rem] text-[color:var(--orange)]"
            >
              Machine.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.85] tracking-tight text-[13vw] md:text-[7.5rem]"
            >
              Deliver.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 max-w-xl text-white/60 text-base md:text-lg leading-relaxed"
          >
            Three generations of foundry and precision-machining expertise, based in
            Jharkhand's industrial belt — building castings, machined components, and
            plant equipment to drawing tolerance, at production scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#rfq"
              className="group inline-flex items-center gap-2 bg-[color:var(--orange)] text-black font-mono text-sm tracking-wide px-6 py-3 hover:bg-white transition-colors"
            >
              REQUEST A QUOTE
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wide px-6 py-3 border border-white/20 hover:border-white/50 transition-colors"
            >
              VIEW CAPABILITIES
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </section>

      {/* ----------------------------------------------------- TICKER */}
      <div className="relative z-10 border-y border-white/10 bg-[#111415] py-3 overflow-hidden">
        <div className="marquee flex whitespace-nowrap font-mono text-xs tracking-[0.25em] text-white/50">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              {item}
              <span className="text-[color:var(--orange)]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------- STATS */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="border-l border-white/15 pl-4">
            <div className="font-display text-4xl md:text-5xl font-bold tabular-nums">
              <AnimatedNumber value={stat.value} decimals={stat.decimals ?? 0} />
              {stat.suffix}
            </div>
            <div className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--steel)] mt-2">
              {stat.unit}
            </div>
            <div className="text-sm text-white/50 mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ----------------------------------------------------- CAPABILITIES */}
      <section id="capabilities" className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <SectionLabel index="SEC. 01" title="Capabilities" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group relative bg-[#0b0d0e] p-8 hover:bg-[#141819] transition-colors min-h-[280px] flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-[color:var(--orange)]" strokeWidth={1.5} />
                  <span className="font-mono text-xs text-white/30">{cap.code}</span>
                </div>
                <h3 className="font-display uppercase text-2xl mt-6 mb-3 tracking-tight">
                  {cap.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">{cap.desc}</p>
                <ul className="mt-auto pt-6 space-y-1.5 border-t border-white/10 mt-6">
                  {cap.specs.map((s) => (
                    <li key={s} className="font-mono text-[11px] text-white/40 flex items-center gap-2">
                      <span className="h-1 w-1 bg-[color:var(--orange)]" />
                      {s}
                    </li>
                  ))}
                </ul>
                <ArrowUpRight className="absolute top-8 right-8 h-4 w-4 text-white/0 group-hover:text-[color:var(--orange)] transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------- PROCESS LINE */}
      <section id="process" className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <SectionLabel index="SEC. 02" title="Production Line" />
        <ProcessLine />
      </section>

      {/* ----------------------------------------------------- GAUGES */}
      <section className="relative z-10 bg-[#111415] border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20">
          <SectionLabel index="SEC. 03" title="Plant Performance" />
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { label: 'On-Time Dispatch', percent: 96 },
              { label: 'First-Pass Yield', percent: 91 },
              { label: 'Machine Utilisation', percent: 88 },
            ].map((g) => (
              <div key={g.label} className="flex items-center gap-6 border border-white/10 p-6">
                <GaugeRing percent={g.percent} />
                <div>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--steel)]">
                    LIVE METRIC
                  </div>
                  <div className="font-display text-xl uppercase mt-1">{g.label}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] text-white/30">
            * Illustrative figures — connect to your MES/ERP feed to display real-time plant data. (TODO)
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------- SECTORS */}
      <section id="sectors" className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <SectionLabel index="SEC. 04" title="Sectors Served" />
        <div className="flex flex-wrap gap-4">
          {SECTORS.map((sector, i) => (
            <motion.div
              key={sector}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-white/15 px-6 py-4 font-display uppercase text-lg tracking-tight hover:border-[color:var(--orange)] hover:text-[color:var(--orange)] transition-colors cursor-default"
            >
              {sector}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- COMPLIANCE */}
      <section id="compliance" className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-20">
        <SectionLabel index="SEC. 05" title="Registration & Compliance" />
        <div className="grid md:grid-cols-3 gap-px bg-white/10">
          {[
            { icon: BadgeCheck, label: 'Udyam Registration', value: 'UDYAM-JH-01-0009732' },
            { icon: ShieldCheck, label: 'Enterprise Category', value: 'Micro, Small & Medium (MSME)' },
            { icon: MapPin, label: 'Registered State', value: 'Jharkhand, India' },
            { icon: BadgeCheck, label: 'GSTIN', value: '20AAWFR7842K1ZQ' },
            { icon: ShieldCheck, label: 'Quality Certification', value: 'ISO 9001:2015' },
            { icon: MapPin, label: 'Registered Office', value: 'Ranchi, Jharkhand — 835219' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-[#0b0d0e] p-8 flex flex-col gap-4">
                <Icon className="h-6 w-6 text-[color:var(--orange)]" strokeWidth={1.5} />
                <div className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--steel)]">
                  {item.label.toUpperCase()}
                </div>
                <div className="font-display text-xl">{item.value}</div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 font-mono text-[11px] text-white/30">
          * Mock registration data for demonstration — replace with Runash's verified GSTIN, ISO certificate number, and registered office.
        </p>
      </section>

      {/* ----------------------------------------------------- RFQ / CONTACT */}
      <section id="rfq" className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 py-24">
        <div className="border border-white/15 relative">
          {/* corner marks */}
          <span className="absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-[color:var(--orange)]" />
          <span className="absolute -top-px -right-px h-4 w-4 border-t-2 border-r-2 border-[color:var(--orange)]" />
          <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-[color:var(--orange)]" />
          <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-[color:var(--orange)]" />

          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-white/15">
              <span className="font-mono text-xs tracking-[0.3em] text-[color:var(--orange)]">
                SEC. 06 · GET A QUOTE
              </span>
              <h2 className="font-display uppercase text-4xl md:text-5xl mt-4 leading-[0.95]">
                Send us your drawing.
              </h2>
              <p className="text-white/55 mt-6 max-w-md leading-relaxed">
                Share part drawings, quantities, and target dates — our engineering
                team will revert with feasibility and a costed quote.
              </p>
              <div className="mt-10 space-y-4 font-mono text-sm">
                <div className="flex items-center gap-3 text-white/60">
                  <Phone className="h-4 w-4 text-[color:var(--orange)]" /> +91 94301 22456
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Mail className="h-4 w-4 text-[color:var(--orange)]" /> sales@runashsons.in
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="h-4 w-4 text-[color:var(--orange)]" /> Plot 14, Ormanjhi Industrial Area, Ranchi, JH 835219
                </div>
              </div>
            </div>

            <RFQForm />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- FOOTER */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-display uppercase text-lg tracking-tight">
              Runash Sons of Industries
            </div>
            <div className="font-mono text-[11px] text-white/40 mt-1">
              UDYAM-JH-01-0009732 · © {new Date().getFullYear()}
            </div>
          </div>
          <div className="flex gap-6 font-mono text-[11px] tracking-[0.2em] text-white/40">
            <a href="#capabilities" className="hover:text-white transition-colors">CAPABILITIES</a>
            <a href="#process" className="hover:text-white transition-colors">PROCESS</a>
            <a href="#compliance" className="hover:text-white transition-colors">COMPLIANCE</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-grid {
          background-image: linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
          background-size: 48px 48px;
          mix-blend-mode: overlay;
        }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .marquee {
          animation: scroll-left 26s linear infinite;
          width: max-content;
        }
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        :global(.font-display) {
          font-family: var(--font-display);
        }
        :global(.font-mono) {
          font-family: var(--font-mono);
        }
      `}</style>
    </main>
  );
}

// ---------------------------------------------------------------
// PROCESS LINE (animated schematic)
// ---------------------------------------------------------------

function ProcessLine() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [active, setActive] = useState<number | null>(null);

  return (
    <div ref={ref} className="relative">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-6 h-px bg-white/10" />
        <motion.div
          className="absolute left-0 top-6 h-px bg-[color:var(--orange)] origin-left"
          style={{ right: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {PROCESS_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className="relative z-10 flex flex-col items-center flex-1 group cursor-default"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.25 }}
                className="h-12 w-12 rounded-full bg-[#0b0d0e] border-2 border-white/20 group-hover:border-[color:var(--orange)] flex items-center justify-center transition-colors"
              >
                <Icon className="h-5 w-5 text-white/70 group-hover:text-[color:var(--orange)] transition-colors" />
              </motion.div>
              <div className="font-mono text-[11px] tracking-[0.15em] text-white/50 mt-4 text-center px-2">
                {step.label.toUpperCase()}
              </div>
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full mt-2 w-40 text-center text-xs text-white/45 leading-snug hidden md:block"
                  >
                    {step.note}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// RFQ FORM
// ---------------------------------------------------------------

function RFQForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'submitted' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      // Hits the mock route at app/api/rfq/route.ts (included alongside this file).
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('submitted');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="p-10 md:p-14">
      {status === 'submitted' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center text-center py-16"
        >
          <BadgeCheck className="h-10 w-10 text-[color:var(--orange)] mb-4" />
          <div className="font-display uppercase text-2xl">Request Received</div>
          <p className="text-white/50 mt-2 text-sm max-w-xs">
            Our engineering team will get back to you within 1–2 business days.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Company / Name" name="name" placeholder="Your company" />
          <Field label="Email" name="email" type="email" placeholder="you@company.com" />
          <Field label="Component / Drawing Ref." name="component" placeholder="e.g. Bracket-A102" />
          <div>
            <label className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--steel)]">
              QUANTITY & TARGET DATE
            </label>
            <textarea
              name="details"
              rows={3}
              placeholder="1,000 units, needed by Q3..."
              className="mt-2 w-full bg-transparent border border-white/15 focus:border-[color:var(--orange)] outline-none px-4 py-3 text-sm placeholder:text-white/25 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center gap-2 bg-[color:var(--orange)] text-black font-mono text-sm tracking-wide px-6 py-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {status === 'loading' ? 'SUBMITTING…' : 'SUBMIT RFQ'}
            {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
          </button>
          {status === 'error' && (
            <p className="font-mono text-[11px] text-red-400">
              Something went wrong — please try again or email sales@runashsons.in directly.
            </p>
          )}
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--steel)]">
        {label.toUpperCase()}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="mt-2 w-full bg-transparent border border-white/15 focus:border-[color:var(--orange)] outline-none px-4 py-3 text-sm placeholder:text-white/25 transition-colors"
      />
    </div>
  );
}
