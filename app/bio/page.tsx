import Image from 'next/image';
import { ArrowUpRight, Mail, Rss } from 'lucide-react';
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
      <header className="rk-bio-hero">
        <div className="rk-bio-visual">
          <div className="rk-bio-portrait">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={256}
              height={256}
              priority
            />
          </div>
          <div className="rk-bio-identity">
            <span>{profile.name}</span>
            <span>{profile.handle}</span>
          </div>
        </div>

        <div className="rk-bio-intro">
          <div className="rk-bio-kicker">About / Bio</div>
          <h1 className="rk-bio-name">
            你好，我是 <span>{profile.name}。</span>
          </h1>
          <p className="rk-bio-lede">
            {profile.lede.map(line => (
              <em key={line}>{line}</em>
            ))}
          </p>
          <div className="rk-bio-copy" dangerouslySetInnerHTML={{ __html: bioHtml }} />
        </div>
      </header>

      <div className="rk-bio-grid">
        <section className="rk-bio-section rk-bio-now">
          <header className="rk-bio-section-head">
            <h2>现在</h2>
            <span>/now</span>
          </header>
          <ul className="rk-now-list">
            {profile.now.map((item, index) => (
              <li key={item}>
                <span className="rk-now-index">{String(index + 1).padStart(2, '0')}</span>
                <div>{item}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rk-bio-section rk-bio-contact">
          <header className="rk-bio-section-head">
            <h2>找到我</h2>
            <span>Links</span>
          </header>
          <ul className="rk-link-list">
            {profile.links.map(link => (
              <li key={link.href}>
                <a href={link.href} rel={link.href.startsWith('http') ? 'me noopener' : undefined}>
                  <span className="rk-link-icon">{iconFor(link.type)}</span>
                  <span>{link.label}</span>
                  <ArrowUpRight className="rk-i rk-link-arrow" strokeWidth={1.75} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rk-bio-section rk-bio-site">
          <header className="rk-bio-section-head">
            <h2>关于本站</h2>
            <span>Rainif.com</span>
          </header>
          <div className="rk-bio-site-copy">
            {siteHtml.map((html, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
          <p className="rk-mono-meta">{profile.version} / {new Date().getFullYear()} / {profile.license}</p>
        </section>
      </div>
    </div>
  );
}
