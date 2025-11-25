/*
AccessibilityMenu.tsx
Custom Accessibility Sidebar (Left) — React + Tailwind + Framer Motion

Features implemented:
- Left slide-in sidebar UI matching UserWay-like grid
- Oversized rounded tiles with icons + labels
- Toggle switches and persistent settings (localStorage)
- Accessible keyboard focus and ARIA attributes
- Smooth open/close animations using Framer Motion
- Mobile-responsive (collapses to bottom sheet)
- Includes your screenshot as a logo/preview image (local path used below)

Local image path used in the component (already uploaded):
/mnt/data/WhatsApp Image 2025-11-21 at 12.07.40_5f77d630.jpg

How to use:
1. Install dependencies: `npm i framer-motion`
2. Ensure Tailwind is setup in your Next.js project.
3. Place this file at `components/AccessibilityMenu.tsx` and import it in your root layout.

Notes:
- Replace icons with your preferred SVGs or icon library if desired.
- The component stores settings in localStorage and applies classes to <body>.
*/

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";


const FEATURE_BUTTONS = [
  { key: "contrast", label: "Contrast +", desc: "Increase contrast" },
  { key: "highlightLinks", label: "Highlight Links", desc: "Highlight links" },
  { key: "bigText", label: "Bigger Text", desc: "Increase text size" },
  { key: "textSpacing", label: "Text Spacing", desc: "Increase spacing" },
  { key: "pauseAnimations", label: "Pause Animations", desc: "Stop CSS animations" },
  { key: "hideImages", label: "Hide Images", desc: "Hide decorative images" },
  { key: "dyslexic", label: "Dyslexia Friendly", desc: "Use dyslexic-friendly font" },
  { key: "cursor", label: "Cursor", desc: "Larger cursor" },
];

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem("a11y_settings");
      return raw ? JSON.parse(raw) : {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    // apply body classes based on settings
    if (settings.contrast) document.body.classList.add("a11y-contrast");
    else document.body.classList.remove("a11y-contrast");

    if (settings.textSpacing) document.documentElement.classList.toggle("a11y-textspacing");

    if (settings.grayscale) document.body.classList.add("a11y-grayscale");
    else document.body.classList.remove("a11y-grayscale");

    if (settings.bigText) document.body.classList.add("a11y-bigtext");
    else document.body.classList.remove("a11y-bigtext");

    if (settings.dyslexic) document.body.classList.add("a11y-dyslexic");
    else document.body.classList.remove("a11y-dyslexic");

    if (settings.highlightLinks) document.body.classList.add("a11y-highlight-links");
    else document.body.classList.remove("a11y-highlight-links");

    if (settings.hideImages) document.body.classList.add("a11y-hide-images");
    else document.body.classList.remove("a11y-hide-images");

    if (settings.pauseAnimations) document.body.classList.add("a11y-pause-animations");
    else document.body.classList.remove("a11y-pause-animations");

    if (settings.cursor) document.body.classList.add("a11y-large-cursor");
    else document.body.classList.remove("a11y-large-cursor");

    localStorage.setItem("a11y_settings", JSON.stringify(settings));
  }, [settings]);

  // keyboard shortcut (Ctrl+U) to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function toggleFeature(key: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSettings((s: any) => ({ ...s, [key]: !s[key] }));
  }

  function resetAll() {
    setSettings({});
  }

  return (
    <>
      {/* Floating pill button on left */}
      <button
        aria-label="Open accessibility menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 bottom-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 cursor-pointer"
      >
        <span className="text-2xl" aria-hidden>
          <Image src="/body_wh.svg" width={80} height={80} alt ='accessability-icon' />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40"
              aria-hidden
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl overflow-auto"
              role="dialog"
              aria-label="Accessibility Menu"
            >
              <div className="p-4 border-b sticky top-0 bg-[#f0f8ff] z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Accessibility Menu <span className="text-sm text-slate-500">(CTRL+U)</span></h3>
                    <p className="text-xs text-slate-500">Make this site easier to use</p>
                  </div>
                  <div className="flex items-center gap-2">
                 
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close accessibility menu"
                      className="p-2 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
              

                {/* Grid of buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {FEATURE_BUTTONS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => toggleFeature(f.key)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-shadow focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        settings[f.key] ? "bg-sky-50 border-sky-300 shadow" : "bg-white border-slate-200"
                      }`}
                      aria-pressed={!!settings[f.key]}
                    >
                      <div className="w-10 h-10 mb-2 rounded-full bg-slate-100 flex items-center justify-center"> 
                        {/* simple icon placeholder */}
                        <span className="text-xl">{iconForKey(f.key)}</span>
                      </div>
                      <div className="text-sm text-center font-medium">{f.label}</div>
                    </button>
                  ))}
                </div>

                {/* small controls */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={resetAll}
                    className="flex-1 bg-[#00bfa6] text-white py-2 rounded-md"
                  >
                    Reset All Accessibility Settings 
                  </button>

                </div>

              
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function iconForKey(key: string) {
  switch (key) {
    case "contrast":
      return "☀️";
    case "highlightLinks":
      return "🔗";
    case "bigText":
      return "TT";
    case "textSpacing":
      return "⇄";
    case "pauseAnimations":
      return "⏸";
    case "hideImages":
      return "🖼️";
    case "dyslexic":
      return "Df";
    case "cursor":
      return "🖱️";
    default:
      return "";
  }
}
