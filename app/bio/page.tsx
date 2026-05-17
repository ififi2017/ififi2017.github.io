import Image from 'next/image';
import { Mail, Rss } from 'lucide-react';
import GitHubIcon from '@/components/icons/GitHubIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';

export const metadata = { title: 'Bio · 关于' };

export default function BioPage() {
  return (
    <div className="rk-screen rk-bio">
      <header className="rk-bio-head">
        <div className="rk-bio-portrait">
          <Image
            src="/avatar.png"
            alt="fi niaR"
            width={256}
            height={256}
            priority
          />
        </div>
        <div>
          <div className="rk-section-tag">BIO · 关于</div>
          <h1 className="rk-bio-name">
            fi niaR <span className="rk-bio-handle">@ififi2017</span>
          </h1>
          <p className="rk-bio-lede">
            <em>write it down,</em><br />
            <em>if</em> it rains.
          </p>
        </div>
      </header>

      <div className="rk-rule" />

      <div className="rk-bio-grid">
        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">关于</h3>
          <p>
            写代码、拍视频、按快门。在 GitHub、YouTube、Instagram 之间来回搬运同一个手感：
            把折腾过的事说清楚，把光线值得的瞬间留下。
          </p>
          <p>
            这里偏好长一点、第一人称的技术 write-up。多过 SEO 友好的标题党；
            旁人能省下一个晚上的时间就够了。
          </p>
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">现在 · /now</h3>
          <ul className="rk-now-list">
            <li>
              <span className="rk-now-dot" />
              <div>把博客从 Hexo 迁到 Next.js，顺带把过往 EFI 配置整理成可索引的格式。</div>
            </li>
            <li>
              <span className="rk-now-dot" />
              <div>在 YouTube <code>@finiar</code> 更新折腾向短片。</div>
            </li>
            <li>
              <span className="rk-now-dot" />
              <div>偶尔在 Instagram <code>@fi_niar</code> 发镜头之外的东西。</div>
            </li>
          </ul>
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">联系</h3>
          <ul className="rk-link-list">
            <li>
              <a href="mailto:if@rainif.com">
                <Mail className="rk-i" strokeWidth={1.75} /> if@rainif.com
              </a>
            </li>
            <li>
              <a href="https://github.com/ififi2017" rel="me noopener">
                <GitHubIcon className="rk-i" strokeWidth={1.75} /> github.com/ififi2017
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@finiar" rel="me noopener">
                <YouTubeIcon className="rk-i" strokeWidth={1.75} /> youtube.com/@finiar
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/fi_niar/" rel="me noopener">
                <InstagramIcon className="rk-i" strokeWidth={1.75} /> instagram.com/fi_niar
              </a>
            </li>
            <li>
              <a href="/rss.xml">
                <Rss className="rk-i" strokeWidth={1.75} /> rainif.com/rss.xml
              </a>
            </li>
          </ul>
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">站点</h3>
          <p>
            由 Next.js + React + Markdown 驱动。文章源文件在 <code>content/posts/*.md</code>，
            <code>git push</code> 即部署。
          </p>
          <p>搜索 / 评论 / RSS 均为构建时生成；零运行时后端。</p>
          <p className="rk-mono-meta">v3.0.0 · {new Date().getFullYear()} · MIT</p>
        </section>
      </div>
    </div>
  );
}
