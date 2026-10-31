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
    <div className="rk-screen rk-bio rk-profile">
      <aside className="rk-profile-card">
        <div className="rk-profile-portrait">
          <Image src={profile.avatar} alt={profile.name} width={256} height={256} priority />
        </div>
        <p className="rk-profile-name">{profile.name}</p>
        <p className="rk-profile-handle">{profile.handle}</p>
        <ul className="rk-profile-links" aria-label="找到我">
          {profile.links.map(link => (
            <li key={link.href}>
              <a href={link.href} rel={link.href.startsWith('http') ? 'me noopener' : undefined}>
                <span className="rk-link-icon">{iconFor(link.type)}</span>
                <span className="rk-profile-link-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="rk-profile-main">
        <header className="rk-profile-intro">
          <p className="rk-profile-kicker">关于我</p>
          <h1>你好，我是 {profile.name}</h1>
          <p className="rk-profile-motto">{profile.lede.join(' ')}</p>
          <div className="rk-profile-copy" dangerouslySetInnerHTML={{ __html: bioHtml }} />
        </header>

        <section className="rk-profile-section" aria-labelledby="studio-title">
          <header className="rk-profile-section-head">
            <div>
              <p className="rk-profile-kicker">正在做</p>
              <h2 id="studio-title">{profile.studio.name}</h2>
            </div>
            <a href={profile.studio.url} className="rk-link-btn">逛逛工作室 <ArrowUpRight className="rk-i" strokeWidth={1.75} /></a>
          </header>
          <p className="rk-profile-section-copy">{profile.studio.description}</p>
          <ol className="rk-profile-projects">
            {profile.studio.projects.map((project, index) => (
              <li key={project.name}>
                <a href={project.url}>
                  <span className="rk-profile-project-index">0{index + 1}</span>
                  <span className="rk-profile-project-body">
                    <span className="rk-profile-project-name">{project.name}</span>
                    <span className="rk-profile-project-desc">{project.description}</span>
                  </span>
                  <span className="rk-profile-project-meta">
                    <span className={`rk-status${project.status === '已上架' ? ' is-live' : ''}`} aria-hidden="true" />
                    {project.type} · {project.status}
                  </span>
                  <ArrowUpRight className="rk-i rk-profile-project-arrow" strokeWidth={1.75} />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="rk-profile-section" aria-labelledby="site-title">
          <header className="rk-profile-section-head">
            <div>
              <p className="rk-profile-kicker">rainif.com</p>
              <h2 id="site-title">关于本站</h2>
            </div>
          </header>
          <div className="rk-profile-site">
            {siteHtml.map((html, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
            <p className="rk-profile-version">{profile.version} · {profile.license}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
