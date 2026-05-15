"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export type Stat = {
  valor: number;
  prefijo?: string | null;
  sufijo?: string | null;
  label: string;
};

type Props = {
  stats: Stat[];
};

function AnimatedNumber({ value, durationMs = 1600 }: { value: number; durationMs?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs]);

  return <span ref={ref}>{display.toLocaleString("es-MX")}</span>;
}

export default function StatsCounter({ stats }: Props) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid gap-8 ${
            stats.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : stats.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {stats.map((s, i) => (
            <motion.div
              key={`${s.label}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-center sm:text-left"
            >
              <div className="font-bebas text-[#121B33] text-6xl sm:text-7xl lg:text-8xl leading-none tracking-tight">
                {s.prefijo}
                <AnimatedNumber value={s.valor} />
                {s.sufijo}
              </div>
              <div className="mt-3 h-px w-12 bg-[#00D4FF] mx-auto sm:mx-0" />
              <p className="mt-4 font-montserrat text-[#666] text-sm leading-relaxed max-w-[18ch] mx-auto sm:mx-0">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
