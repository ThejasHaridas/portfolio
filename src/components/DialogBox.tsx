'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckpointDialog,
  ZoneId,
  SKILLS,
  PROJECTS,
  EXPERIENCE,
} from '@/lib/gameData';

interface DialogBoxProps {
  dialog: CheckpointDialog;
  onClose: () => void;
}

// ─── Skills Panel ─────────────────────────────────────────────────────────
function SkillsPanel() {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {SKILLS.map((skill) => (
        <div key={skill.name}>
          <div className="flex justify-between mb-1">
            <span className="font-pixel text-gray-300" style={{ fontSize: 7 }}>
              {skill.name}
            </span>
            <span className="font-pixel" style={{ fontSize: 7, color: skill.color }}>
              {skill.level}%
            </span>
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

// ─── Projects Panel ──────────────────────────────────────────────────────
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
              className="text-left border border-gray-700 p-2 hover:border-yellow-500 transition-colors bg-gray-900/60 group"
            >
              <div className="font-pixel text-yellow-300 group-hover:text-yellow-400 mb-1" style={{ fontSize: 7 }}>
                📜 {p.title}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="font-pixel bg-gray-800 text-gray-400 px-1"
                    style={{ fontSize: 6 }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="font-pixel text-yellow-400 mb-3 hover:text-yellow-300"
            style={{ fontSize: 7 }}
          >
            ← Back to Quests
          </button>
          <div className="border border-yellow-700 p-3 bg-gray-900/60">
            <div className="font-pixel text-yellow-300 mb-2" style={{ fontSize: 8 }}>
              {proj?.title}
            </div>
            <p className="font-pixel text-gray-300 leading-relaxed mb-3" style={{ fontSize: 7 }}>
              {proj?.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {proj?.tags.map((t) => (
                <span
                  key={t}
                  className="font-pixel border border-green-700 text-green-400 px-2 py-0.5"
                  style={{ fontSize: 6 }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Experience Panel ─────────────────────────────────────────────────────
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
              <div className="font-pixel mb-0.5" style={{ fontSize: 8, color: exp.color }}>
                {exp.role}
              </div>
              <div className="font-pixel text-gray-300" style={{ fontSize: 7 }}>
                {exp.company}
              </div>
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

// ─── Contact Panel ────────────────────────────────────────────────────────
function ContactPanel() {
  const links = [
    {
      label: 'GitHub',
      icon: '🐙',
      href: 'https://github.com/thejasharidas',
      color: '#e2e8f0',
    },
    {
      label: 'LinkedIn',
      icon: '💼',
      href: 'https://linkedin.com/in/thejasharidas',
      color: '#60a5fa',
    },
    {
      label: 'Email',
      icon: '📧',
      href: 'mailto:thejasharidas@gmail.com',
      color: '#34d399',
    },
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
          <span
            className="font-pixel group-hover:underline"
            style={{ fontSize: 8, color: l.color }}
          >
            {l.label}
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── Main Dialog Box ──────────────────────────────────────────────────────
export default function DialogBox({ dialog, onClose }: DialogBoxProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typeIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const page = dialog.pages[currentPage];
  const totalPages = dialog.pages.length;

  // Reset typewriter when page changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    typeIndexRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const text = page.text;
    intervalRef.current = setInterval(() => {
      typeIndexRef.current++;
      setDisplayedText(text.slice(0, typeIndexRef.current));
      if (typeIndexRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 28);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPage, page.text]);

  // Reset page when dialog changes
  useEffect(() => {
    setCurrentPage(0);
  }, [dialog.zoneId]);

  // Space bar to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  function handleAdvance() {
    if (isTyping) {
      // Skip typewriter
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(page.text);
      setIsTyping(false);
    } else if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else {
      onClose();
    }
  }

  const accentForZone: Record<ZoneId, string> = {
    crossroads: '#a3e635',
    'scholars-hollow': '#a78bfa',
    academy: '#60a5fa',
    guild: '#fbbf24',
    forge: '#f97316',
    'quest-board': '#34d399',
    tavern: '#e879f9',
  };
  const accent = accentForZone[dialog.zoneId] ?? '#ca8a04';

  return (
    <AnimatePresence>
      <motion.div
        key="dialog-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center px-3 pb-4 sm:pb-8"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={handleAdvance}
      >
        <motion.div
          key="dialog-box"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Outer border — layered for RPG look */}
          <div
            className="relative bg-[#0a0a18] p-4"
            style={{
              border: `4px solid ${accent}`,
              boxShadow: `0 0 0 4px #000, 0 0 0 8px ${accent}44, inset 0 0 0 2px #000, 0 12px 40px rgba(0,0,0,0.9)`,
            }}
          >
            {/* Corner decorations */}
            {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map(
              (pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-3 h-3`}
                  style={{ background: accent }}
                />
              )
            )}

            {/* Portrait + text row */}
            <div className="flex gap-3 items-start">
              {/* Portrait */}
              <div
                className="flex-shrink-0 flex items-center justify-center text-2xl"
                style={{
                  width: 56,
                  height: 56,
                  border: `3px solid ${accent}`,
                  background: '#111',
                  boxShadow: `0 0 12px ${accent}66`,
                }}
              >
                {dialog.portrait}
              </div>

              {/* Text area */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-pixel mb-2"
                  style={{ fontSize: 9, color: accent, letterSpacing: 1 }}
                >
                  {dialog.title}
                </div>
                <div className="font-pixel text-gray-100" style={{ fontSize: 8, lineHeight: 2 }}>
                  {displayedText}
                  {isTyping && (
                    <span className="cursor-blink" style={{ color: accent }}>
                      ▌
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Rich component panel — shown after typing finishes */}
            {!isTyping && page.component && (
              <div
                className="mt-4 pt-3"
                style={{ borderTop: `2px solid ${accent}33` }}
              >
                {page.component === 'skills'     && <SkillsPanel />}
                {page.component === 'projects'   && <ProjectsPanel />}
                {page.component === 'contact'    && <ContactPanel />}
                {page.component === 'experience' && <ExperiencePanel />}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-4">
              <div className="font-pixel text-gray-600" style={{ fontSize: 7 }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <span key={i} style={{ color: i === currentPage ? accent : '#374151' }}>
                    ●
                  </span>
                ))}
              </div>
              <div
                className="font-pixel animate-pulse"
                style={{ fontSize: 7, color: accent }}
                onClick={handleAdvance}
              >
                {isTyping
                  ? 'CLICK TO SKIP ▶'
                  : currentPage < totalPages - 1
                    ? 'NEXT ▶'
                    : 'CLOSE ✕'}
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="font-pixel text-gray-600 text-center mt-1" style={{ fontSize: 6 }}>
              [SPACE / ENTER] to continue · [ESC] to close
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
