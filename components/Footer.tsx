import { Mail, Rss } from 'lucide-react';
import GitHubIcon from '@/components/icons/GitHubIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="rk-footer">
      <div className="rk-footer-inner">
        <div className="rk-footer-meta">
          <span>© {YEAR} fi niaR</span>
          <span className="rk-dot">·</span>
          <span>rainif.com</span>
          <span className="rk-dot">·</span>
          <span>Code MIT</span>
          <span className="rk-dot">·</span>
          <span>Content CC BY-NC-SA 4.0</span>
          <span className="rk-dot">·</span>
          <span>Media all rights reserved</span>
        </div>
        <div className="rk-footer-social">
          <a href="https://github.com/ififi2017" title="GitHub" aria-label="GitHub" rel="me noopener">
            <GitHubIcon className="rk-i" strokeWidth={1.75} />
          </a>
          <a href="https://www.youtube.com/@finiar" title="YouTube" aria-label="YouTube" rel="me noopener">
            <YouTubeIcon className="rk-i" strokeWidth={1.75} />
          </a>
          <a href="https://www.instagram.com/fi_niar/" title="Instagram" aria-label="Instagram" rel="me noopener">
            <InstagramIcon className="rk-i" strokeWidth={1.75} />
          </a>
          <a href="mailto:if@rainif.com" title="Email" aria-label="Email">
            <Mail className="rk-i" strokeWidth={1.75} />
          </a>
          <a href="/rss.xml" title="RSS" aria-label="RSS">
            <Rss className="rk-i" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
