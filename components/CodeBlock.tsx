'use client';

import { useEffect } from 'react';

/**
 * Enhances Shiki-highlighted code blocks in the article body with a language
 * label (when the fence specified one) and a copy button.
 *
 * The article HTML is injected via dangerouslySetInnerHTML and never
 * re-rendered by React, so we DOM-manipulate directly. Each <pre> is wrapped
 * in a non-scrolling .rk-code container so the toolbar stays put while wide
 * code scrolls horizontally. Wrapping is idempotent (guarded), and copy
 * clicks are handled by a single delegated listener so re-running the effect
 * (e.g. React strict mode) can't orphan per-button handlers.
 */
export default function CodeBlock() {
  useEffect(() => {
    const article = document.querySelector('.rk-prose');
    if (!article) return;

    article.querySelectorAll<HTMLPreElement>('pre.shiki').forEach(pre => {
      if (pre.parentElement?.classList.contains('rk-code')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'rk-code';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const toolbar = document.createElement('div');
      toolbar.className = 'rk-code-toolbar';

      const lang = pre.getAttribute('data-language');
      if (lang) {
        const label = document.createElement('span');
        label.className = 'rk-code-lang';
        label.textContent = lang;
        toolbar.appendChild(label);
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rk-code-copy';
      btn.setAttribute('aria-label', '复制代码');
      btn.textContent = '复制';
      toolbar.appendChild(btn);

      wrapper.appendChild(toolbar);
    });

    const resetTimers = new WeakMap<HTMLButtonElement, ReturnType<typeof setTimeout>>();

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const btn = target?.closest<HTMLButtonElement>('.rk-code-copy');
      if (!btn) return;

      const code = btn.closest('.rk-code')?.querySelector('code');
      const text = code?.textContent ?? '';
      if (!text) return;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          btn.textContent = '已复制';
          btn.classList.add('is-copied');
          clearTimeout(resetTimers.get(btn));
          resetTimers.set(
            btn,
            setTimeout(() => {
              btn.textContent = '复制';
              btn.classList.remove('is-copied');
            }, 1600),
          );
        })
        .catch(() => {
          /* clipboard blocked (insecure context / permission) — no-op */
        });
    };

    article.addEventListener('click', onClick);
    return () => article.removeEventListener('click', onClick);
  }, []);

  return null;
}
