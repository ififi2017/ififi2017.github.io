import Image from 'next/image';
import { Mail, Rss } from 'lucide-react';
import GitHubIcon from '@/components/icons/GitHubIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { getBioHtml, getInlineMarkdownHtml, getProfile, type ProfileLink } from '@/lib/site';

export const metadata = { title: 'Bio · 关于' };

const iconFor = (type: ProfileLink['type']) => {
  switch (type) {
    case 'email':
      return <Mail className="rk-i" strokeWidth={1.75} />;
    case 'github':
      return <GitHubIcon className="rk-i" strokeWidth={1.75} />;
    case 'youtube':
      return <YouTubeIcon className="rk-i" strokeWidth={1.75} />;
    case 'instagram':
      return <InstagramIcon className="rk-i" strokeWidth={1.75} />;
    case 'rss':
      return <Rss className="rk-i" strokeWidth={1.75} />;
  }
};

export default async function BioPage() {
  const profile = getProfile();
  const bioHtml = await getBioHtml();
  const siteHtml = await Promise.all(profile.site.map(getInlineMarkdownHtml));

  return (
    <div className="rk-screen rk-bio">
      <header className="rk-bio-head">
        <div className="rk-bio-portrait">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={256}
            height={256}
            priority
          />
        </div>
        <div>
          <div className="rk-section-tag">BIO · 关于</div>
          <h1 className="rk-bio-name">
            {profile.name} <span className="rk-bio-handle">{profile.handle}</span>
          </h1>
          <p className="rk-bio-lede">
            {profile.lede.map(line => (
              <span key={line}>
                <em>{line}</em><br />
              </span>
            ))}
          </p>
        </div>
      </header>

      <div className="rk-rule" />

      <div className="rk-bio-grid">
        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">关于</h3>
          <div dangerouslySetInnerHTML={{ __html: bioHtml }} />
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">现在 · /now</h3>
          <ul className="rk-now-list">
            {profile.now.map(item => (
              <li key={item}>
                <span className="rk-now-dot" />
                <div>{item}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">联系</h3>
          <ul className="rk-link-list">
            {profile.links.map(link => (
              <li key={link.href}>
                <a href={link.href} rel={link.href.startsWith('http') ? 'me noopener' : undefined}>
                  {iconFor(link.type)} {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">站点</h3>
          {siteHtml.map((html, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
          <p className="rk-mono-meta">{profile.version} · {new Date().getFullYear()} · {profile.license}</p>
        </section>
      </div>
    </div>
  );
}
