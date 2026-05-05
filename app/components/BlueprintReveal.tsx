"use client";

import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useState } from "react";

const traceEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const trace: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.4, delay, ease: traceEase }, opacity: { duration: 0.2, delay } },
  }),
};

const fade = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({ opacity: 1, transition: { duration: 0.5, delay } }),
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono tracking-[0.25em] text-[#00D4FF]/70 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function BlueprintReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [form, setForm] = useState({ nombre: "", telefono: "", carrera: "" });
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <section
      id="agenda-recorrido"
      ref={ref}
      className="relative overflow-hidden bg-[#121B33] py-32 px-6 md:px-12 scroll-mt-20"
    >
      {/* grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* corner markers */}
      <CornerMarker className="top-8 left-8" />
      <CornerMarker className="top-8 right-8" rotate={90} />
      <CornerMarker className="bottom-8 right-8" rotate={180} />
      <CornerMarker className="bottom-8 left-8" rotate={270} />

      <div className="relative max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* SVG blueprint */}
        <div className="relative aspect-square w-full max-w-[560px] mx-auto lg:mx-0">
          <motion.div
            variants={fade}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0}
            className="absolute top-0 left-0 text-[10px] font-mono tracking-[0.2em] text-[#00D4FF]/70"
          >
            REF_01 · ENGINEERING BLUEPRINT
          </motion.div>
          <motion.div
            variants={fade}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.2}
            className="absolute bottom-0 right-0 text-[10px] font-mono tracking-[0.2em] text-[#00D4FF]/70"
          >
            SCALE 1:1 · CENYCA.MX
          </motion.div>

          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            fill="none"
            stroke="#00D4FF"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer reference frame */}
            <motion.rect
              x="20"
              y="20"
              width="360"
              height="360"
              stroke="#00D4FF"
              strokeOpacity={0.25}
              strokeDasharray="4 6"
              variants={trace}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.1}
            />

            {/* Dimension lines */}
            <motion.path
              d="M 20 10 L 380 10 M 20 5 L 20 15 M 380 5 L 380 15"
              stroke="#00D4FF"
              strokeOpacity={0.4}
              variants={trace}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.3}
            />
            <motion.path
              d="M 390 20 L 390 380 M 385 20 L 395 20 M 385 380 L 395 380"
              stroke="#00D4FF"
              strokeOpacity={0.4}
              variants={trace}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.35}
            />

            {/* Center cross-hairs */}
            <motion.path
              d="M 200 120 L 200 280 M 120 200 L 280 200"
              stroke="#00D4FF"
              strokeOpacity={0.3}
              strokeDasharray="3 4"
              variants={trace}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={0.5}
            />

            {/* Engrane completo — rota despacio en bucle alrededor del centro (200,200) */}
            <motion.g
              style={{ transformOrigin: "200px 200px", transformBox: "fill-box" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {/* Outer gear teeth */}
              <motion.path
                d={gearPath(200, 200, 140, 110, 16)}
                variants={trace}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={0.6}
              />

              {/* Inner rings */}
              <motion.circle
                cx="200"
                cy="200"
                r="85"
                variants={trace}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={0.9}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="55"
                variants={trace}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={1.05}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="18"
                fill="#00D4FF"
                fillOpacity={0.15}
                variants={trace}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={1.2}
              />

              {/* Mounting holes */}
              {[
                [140, 140],
                [260, 140],
                [140, 260],
                [260, 260],
              ].map(([cx, cy], i) => (
                <motion.circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r="6"
                  variants={trace}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  custom={1.3 + i * 0.08}
                />
              ))}
            </motion.g>

            {/* Annotation leader lines + labels */}
            <motion.path
              d="M 280 60 L 320 60 L 320 30"
              stroke="#E9C176"
              strokeOpacity={0.7}
              variants={trace}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1.7}
            />
            <motion.text
              x="322"
              y="24"
              fill="#E9C176"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.15em"
              stroke="none"
              variants={fade}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1.9}
            >
              Ø 280
            </motion.text>

            <motion.path
              d="M 120 200 L 60 200 L 60 370"
              stroke="#E9C176"
              strokeOpacity={0.7}
              variants={trace}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1.8}
            />
            <motion.text
              x="30"
              y="380"
              fill="#E9C176"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.15em"
              stroke="none"
              variants={fade}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={2.0}
            >
              AXIS_Y
            </motion.text>
          </svg>
        </div>

        {/* Copy */}
        <div>
          <motion.p
            variants={fade}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.2}
            className="text-[#00D4FF] font-mono text-xs tracking-[0.25em] uppercase mb-6"
          >
            Del plano — al prototipo
          </motion.p>
          <motion.h2
            variants={fade}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.4}
            className="font-extrabold text-white mb-8"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            No enseñamos ingeniería.<br />
            <span className="text-[#00D4FF]">La practicamos.</span>
          </motion.h2>
          <motion.p
            variants={fade}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.6}
            className="text-white/60 text-base leading-relaxed max-w-lg mb-8"
          >
            Cada programa se construye como un sistema. Cuéntanos qué quieres
            estudiar y un asesor te contacta.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            variants={fade}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={0.9}
            className="relative rounded-xl border border-[#00D4FF]/20 bg-[#0d1430]/60 backdrop-blur-sm p-6 max-w-lg"
          >
            {/* form corner markers */}
            <span aria-hidden className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[#00D4FF]/60" />
            <span aria-hidden className="absolute -top-px -right-px w-3 h-3 border-t border-r border-[#00D4FF]/60" />
            <span aria-hidden className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-[#00D4FF]/60" />
            <span aria-hidden className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-[#00D4FF]/60" />

            {enviado ? (
              <div className="text-center py-6">
                <p className="text-[#00D4FF] font-mono text-xs tracking-[0.25em] uppercase mb-3">
                  STATUS · OK
                </p>
                <h3 className="text-xl font-bold text-white mb-2">
                  Solicitud recibida
                </h3>
                <p className="text-white/60 text-sm">
                  Un asesor te contactará en las próximas horas.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[#E9C176] font-mono text-[10px] tracking-[0.25em] uppercase mb-4">
                  FORM_01 · SOLICITA INFORMACIÓN
                </p>

                <div className="space-y-4">
                  <FormField label="NOMBRE">
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#00D4FF] outline-none text-white placeholder-white/25 text-sm py-2 transition-colors"
                    />
                  </FormField>

                  <FormField label="WHATSAPP">
                    <input
                      type="tel"
                      required
                      placeholder="664 000 0000"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#00D4FF] outline-none text-white placeholder-white/25 text-sm py-2 transition-colors"
                    />
                  </FormField>

                  <FormField label="CARRERA">
                    <select
                      required
                      value={form.carrera}
                      onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#00D4FF] outline-none text-sm py-2 transition-colors appearance-none"
                      style={{ color: form.carrera ? "white" : "rgba(255,255,255,0.25)" }}
                    >
                      <option value="" disabled style={{ background: "#0d1430" }}>
                        Selecciona una opción
                      </option>
                      {[
                        "Gastronomía",
                        "Criminología",
                        "Derecho",
                        "Psicología",
                        "Administración",
                        "Contaduría",
                        "Pedagogía",
                        "Comunicación",
                        "Ing. en Sistemas",
                        "Ing. Industrial",
                      ].map((c) => (
                        <option key={c} value={c} style={{ background: "#0d1430" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <button
                  type="submit"
                  className="group mt-6 w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0d1430] font-bold text-sm uppercase tracking-wider py-3 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,212,255,0.35)]"
                >
                  Quiero información →
                </button>

                <p className="text-white/35 text-[10px] font-mono tracking-[0.2em] uppercase text-center mt-3">
                  Respuesta en minutos · Sin compromiso
                </p>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function CornerMarker({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <div
      aria-hidden
      className={`absolute ${className} w-4 h-4`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00D4FF]/50" />
      <div className="absolute top-0 left-0 w-[1px] h-full bg-[#00D4FF]/50" />
    </div>
  );
}

// Build a gear-like path: alternating outer/inner radii over N teeth.
function gearPath(cx: number, cy: number, rOuter: number, rInner: number, teeth: number) {
  const steps = teeth * 4; // two points per tooth edge × 2 edges
  let d = "";
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const phase = i % 4;
    const r = phase === 0 || phase === 3 ? rOuter : rInner;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + "Z";
}
