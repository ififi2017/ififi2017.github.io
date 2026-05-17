'use client';

import { useEffect, useRef, useState } from 'react';

// Type declarations for the live2d-widget global API (loaded at runtime from CDN).
declare global {
  interface Window {
    L2Dwidget?: { init: (config: Record<string, unknown>) => void };
  }
}

const isReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Live2D 看板娘 — 移植自旧站的 `live2dw/`（wanko 模型）。
 *
 * 新花样：
 *  - 点击看板娘 → 全屏触发一阵 8 秒珊瑚雨；
 *  - 每次开雨随机抽一条来自当前页面 / 时段的「碎语」；
 *  - 雨滴使用 `--brand-accent` 着色 → 跟随主色变化（深靛蓝）；
 *  - `prefers-reduced-motion` 用户：看板娘照常显示，雨效自动跳过。
 *  - 移动端默认隐藏（看板娘在小屏会挤占阅读区）。
 */
export default function Live2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rainKey, setRainKey] = useState(0);
  const [whisper, setWhisper] = useState<string | null>(null);

  // Boot the live2d-widget script once.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip on small screens — keeps the right edge clean for mobile readers.
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const SCRIPT_SRC = 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/L2Dwidget.min.js';
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

    const init = () => {
      window.L2Dwidget?.init({
        model: {
          jsonPath: '/live2d/assets/wanko.model.json',
          scale: 1,
        },
        display: {
          position: 'right',
          width: 130,
          height: 220,
          hOffset: 16,
          vOffset: -20,
        },
        mobile: { show: false },
        react: { opacityDefault: 0.85, opacityOnHover: 1 },
        dialog: { enable: false }, // we render our own "whisper" so we can theme it
      });
    };

    if (existing) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    }

    return () => {
      // The widget injects its own canvas. Leave it; remounts would be janky.
    };
  }, []);

  // Click handler on the overlay: triggers rain + whisper.
  const onActivate = () => {
    if (isReducedMotion()) {
      setWhisper(pickWhisper());
      return;
    }
    setRainKey(k => k + 1);
    setWhisper(pickWhisper());
  };

  // Auto-clear whisper after a beat.
  useEffect(() => {
    if (!whisper) return;
    const t = setTimeout(() => setWhisper(null), 4200);
    return () => clearTimeout(t);
  }, [whisper]);

  return (
    <div className="rk-live2d-anchor" ref={containerRef}>
      {/* Transparent click overlay that sits roughly where the canvas lands.
          We listen here so we don't have to monkey-patch the widget's own click events. */}
      <button
        type="button"
        className="rk-live2d-tap"
        onClick={onActivate}
        aria-label="召唤一阵雨"
        title="点一下看看"
      />

      {whisper && (
        <div className="rk-live2d-whisper" key={whisper + rainKey}>
          {whisper}
        </div>
      )}

      {rainKey > 0 && <Rainfall key={rainKey} />}
    </div>
  );
}

const WHISPERS = [
  '又下雨了。',
  '写一行吧。',
  '记下来才算数。',
  'git push 之前再看一遍。',
  '今天的快门按了吗？',
  '电脑修好了？',
  '咖啡续上。',
  '雨停之前再写一段。',
];

const pickWhisper = () => WHISPERS[Math.floor(Math.random() * WHISPERS.length)];

const RAIN_COUNT = 90;

type Drop = { left: number; delay: number; dur: number; len: number; opacity: number };

function Rainfall() {
  // Generate stable random params for each drop on mount.
  const dropsRef = useRef<Drop[] | null>(null);
  if (dropsRef.current === null) {
    dropsRef.current = Array.from({ length: RAIN_COUNT }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      dur: 0.8 + Math.random() * 1.4,
      len: 14 + Math.random() * 26,
      opacity: 0.35 + Math.random() * 0.45,
    }));
  }
  const drops = dropsRef.current;

  // Self-destruct after the longest drop has finished.
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAlive(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!alive) return null;

  return (
    <div className="rk-rain" aria-hidden="true">
      {drops.map((d, i) => (
        <span
          key={i}
          className="rk-rain-drop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
            height: `${d.len}px`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
