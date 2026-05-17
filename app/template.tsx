'use client';

import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';

/**
 * Per-route enter animation.
 *
 * Next.js App Router remounts `template.tsx` on every navigation, so we can
 * piggy-back on that to fade + slide-up the new page. We also key on the
 * pathname so the animation re-fires even when only the dynamic segment
 * changes (e.g. /posts/foo → /posts/bar).
 *
 * Respects `prefers-reduced-motion`: motion will skip the transform/opacity
 * tween and just snap the content into place.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
