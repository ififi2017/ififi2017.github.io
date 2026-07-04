'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const GOATCOUNTER_CODE = 'rainif';

/**
 * Reads the pageview count for the current path from GoatCounter's counter
 * endpoint and renders it in the post meta row.
 *
 * Requires "Allow adding visitor counts on your website" to be enabled in the
 * GoatCounter site settings; until then (or before any data accrues) the
 * request fails and we render nothing, so the meta row degrades cleanly.
 *
 * We read window.location.pathname rather than the slug so the queried path
 * matches exactly what count.js recorded (trailing slash included).
 */
export default function PostViews() {
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const url = `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${encodeURIComponent(path)}.json`;
    let cancelled = false;

    fetch(url)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { count?: string }) => {
        if (!cancelled && data?.count) setCount(String(data.count).trim());
      })
      .catch(() => {
        /* not enabled yet, or no data for this path — show nothing */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!count) return null;

  return (
    <span className="rk-meta-item">
      <Eye className="rk-i" strokeWidth={1.75} />
      {count} 次浏览
    </span>
  );
}
