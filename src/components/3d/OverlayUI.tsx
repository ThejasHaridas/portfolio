'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoneId, DIALOGS, SKILLS, PROJECTS, EXPERIENCE, ZONES } from '@/lib/gameData';

interface OverlayUIProps {
  activeZone: ZoneId | null;
  visitedZones: Set<ZoneId>;
  onClose: () => void;
}

const ZONE_META: Record<ZoneId, { icon: string; label: string; color: string }> = {
  crossroads: { icon: '🗺️', label: 'Start', color: '#a3e635' },
  'scholars-hollow': { icon: '📖', label: 'About', color: '#a78bfa' },
  academy: { icon: '🎓', label: 'Education', color: '#60a5fa' },
  guild: { icon: '🏛️', label: 'Experience', color: '#fbbf24' },
  forge: { icon: '⚒️', label: 'Skills', color: '#f97316' },
  'quest-board': { icon: '📜', label: 'Projects', color: '#34d399' },
  tavern: { icon: '🍺', label: 'Contact', color: '#e879f9' },
};

export default function OverlayUI({ activeZone, visitedZones, onClose }: OverlayUIProps) {
  const progress = Math.round((visitedZones.size / ZONES.length) * 100);

  return (
    <>
      {/* Top HUD bar */}
      <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
        >
          <div className="font-pixel text-yellow-400" style={{ fontSize: 8 }}>
            THEJAS HARIDAS
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {ZONES.map((zone) => {
                const meta = ZONE_META[zone.id];
                const visited = visitedZones.has(zone.id);
                return (
                  <div
                    key={zone.id}
                    className="w-5 h-5 flex items-center justify-center rounded-full text-xs"
                    style={{
                      border: `1px solid ${visited ? meta.color : '#333'}`,
                      background: visited ? meta.color + '33' : 'rgba(0,0,0,0.4)',
                      fontSize: 10,
                    }}
                    title={meta.label}
                  >
                    {visited ? meta.icon : ''}
                  </div>
                );
              })}
            </div>
            <div className="w-20 h-1.5 bg-gray-800 overflow-hidden rounded-full">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #a3e635, #34d399)',
                }}
              />
            </div>
            <span className="font-pixel text-gray-500" style={{ fontSize: 6 }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Info panel when zone is active */}
      <AnimatePresence>
        {activeZone && (
          <InfoPanel
            zoneId={activeZone}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Info Panel ───────────────────────────────────────────────────────────
function InfoPanel({ zoneId, onClose }: { zoneId: ZoneId; onClose: () => void }) {
  const dialog = DIALOGS[zoneId];
  const meta = ZONE_META[zoneId];
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fullText = dialog.pages.map(p => p.text).join(' ');
  const hasComponent = dialog.pages.some(p => p.component);
  const componentType = dialog.pages.find(p => p.component)?.component;

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    typeRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      typeRef.current++;
      setDisplayedText(fullText.slice(0, typeRef.current));
      if (typeRef.current >= fullText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 20);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [zoneId, fullText]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0c0c1a',
          border: `2px solid ${meta.color}`,
          boxShadow: `0 0 40px ${meta.color}33, inset 0 0 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: `1px solid ${meta.color}44` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{meta.icon}</span>
            <div>
              <div className="font-pixel" style={{ fontSize: 10, color: meta.color }}>
                {dialog.title}
              </div>
              <div className="font-pixel text-gray-500" style={{ fontSize: 6 }}>
                {meta.label.toUpperCase()} ZONE
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-pixel text-gray-500 hover:text-white transition-colors px-2 py-1"
            style={{ fontSize: 8 }}
          >
            ESC
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="font-pixel text-gray-200 leading-relaxed" style={{ fontSize: 7, lineHeight: 2.2 }}>
            {displayedText}
            {isTyping && <span className="cursor-blink" style={{ color: meta.color }}>▌</span>}
          </p>

          {/* Rich component */}
          {!isTyping && hasComponent && (
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${meta.color}22` }}>
              {componentType === 'skills' && <SkillsPanel />}
              {componentType === 'projects' && <ProjectsPanel />}
              {componentType === 'experience' && <ExperiencePanel />}
              {componentType === 'contact' && <ContactPanel />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2 flex justify-between items-center"
          style={{ borderTop: `1px solid ${meta.color}22` }}
        >
          <span className="font-pixel text-gray-600" style={{ fontSize: 6 }}>
            CLICK OUTSIDE OR PRESS ESC TO CLOSE
          </span>
          <span className="font-pixel" style={{ fontSize: 6, color: meta.color }}>
            DRIVE TO NEXT ZONE →
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────
function SkillsPanel() {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {SKILLS.map((skill) => (
        <div key={skill.name}>
          <div className="flex justify-between mb-1">
            <span className="font-pixel text-gray-300" style={{ fontSize: 7 }}>{skill.name}</span>
            <span className="font-pixel" style={{ fontSize: 7, color: skill.color }}>{skill.level}%</span>
          </div>
          <div className="h-2 bg-gray-800 border border-gray-700">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: filled ? `${skill.level}%` : '0%',
                background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────
function ProjectsPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const proj = selected ? PROJECTS.find((p) => p.id === selected) : null;

  return (
    <div>
      {!selected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="text-left border border-gray-700 p-2 hover:border-green-500 transition-colors bg-gray-900/60 group"
            >
              <div className="font-pixel text-green-300 group-hover:text-green-400 mb-1" style={{ fontSize: 7 }}>
                {p.title}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="font-pixel bg-gray-800 text-gray-400 px-1" style={{ fontSize: 6 }}>{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="font-pixel text-green-400 mb-3 hover:text-green-300"
            style={{ fontSize: 7 }}
          >
            ← Back
          </button>
          <div className="border border-green-700/50 p-3 bg-gray-900/60">
            <div className="font-pixel text-green-300 mb-2" style={{ fontSize: 8 }}>{proj?.title}</div>
            <p className="font-pixel text-gray-300 leading-relaxed mb-3" style={{ fontSize: 7 }}>{proj?.description}</p>
            <div className="flex flex-wrap gap-1">
              {proj?.tags.map((t) => (
                <span key={t} className="font-pixel border border-green-700 text-green-400 px-2 py-0.5" style={{ fontSize: 6 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────
function ExperiencePanel() {
  return (
    <div className="space-y-3">
      {EXPERIENCE.map((exp) => (
        <div
          key={exp.id}
          className="border p-3 bg-gray-900/60 relative"
          style={{ borderColor: exp.color + '66' }}
        >
          {exp.current && (
            <span
              className="absolute top-2 right-2 font-pixel px-1"
              style={{ fontSize: 6, color: exp.color, border: `1px solid ${exp.color}` }}
            >
              ACTIVE
            </span>
          )}
          <div className="flex items-start gap-2">
            <span className="text-xl">{exp.icon}</span>
            <div>
              <div className="font-pixel mb-0.5" style={{ fontSize: 8, color: exp.color }}>{exp.role}</div>
              <div className="font-pixel text-gray-300" style={{ fontSize: 7 }}>{exp.company}</div>
              <div className="font-pixel text-gray-500 mt-0.5" style={{ fontSize: 6 }}>
                {exp.location} · {exp.type} · {exp.duration}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────
function ContactPanel() {
  const links = [
    { label: 'GitHub', icon: '🐙', href: 'https://github.com/thejasharidas', color: '#e2e8f0' },
    { label: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/in/thejasharidas', color: '#60a5fa' },
    { label: 'Email', icon: '📧', href: 'mailto:thejasharidas@gmail.com', color: '#34d399' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center gap-2 border p-3 hover:bg-gray-800/60 transition-colors group"
          style={{ borderColor: l.color + '55' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-lg">{l.icon}</span>
          <span className="font-pixel group-hover:underline" style={{ fontSize: 8, color: l.color }}>{l.label}</span>
        </a>
      ))}
    </div>
  );
}
