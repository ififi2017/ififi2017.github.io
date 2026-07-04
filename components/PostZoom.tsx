'use client';

import { useEffect } from 'react';
import type { Zoom } from 'medium-zoom';

/** Attaches a click-to-zoom lightbox to every image in the article body. */
export default function PostZoom() {
  useEffect(() => {
    let zoom: Zoom | undefined;
    let cancelled = false;
    import('medium-zoom').then(({ default: mediumZoom }) => {
      if (cancelled) return;
      zoom = mediumZoom('.rk-prose img', {
        margin: 24,
        background: 'var(--bg-page)',
      });
    });
    return () => {
      cancelled = true;
      zoom?.detach();
    };
  }, []);

  return null;
}
