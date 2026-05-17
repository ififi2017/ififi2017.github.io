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
            热爱使用各类 Vibe Coding 工具。Claude Code、Codex 连轴转。灵感的上限是 Usage。
          </p>
          <p>
            想到什么发什么，概率性月更、年更、甚至可能永远不更。
          </p>
          <p>
            感谢 Claude Code 重构了这整个 Blog。
          </p>
        </section>

        <section className="rk-bio-section">
          <h3 className="rk-bio-section-title">现在 · /now</h3>
          <ul className="rk-now-list">
            <li>
              <span className="rk-now-dot" />
              <div>在 Shanghai 当 IT 牛马。</div>
            </li>
            <li>
              <span className="rk-now-dot" />
              <div>手持 Sony A7C2 想打鸟。</div>
            </li>
            <li>
              <span className="rk-now-dot" />
              <div>偶尔在 Instagram 与 YouTube 上发拍到的东西。</div>
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
