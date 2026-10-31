import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rk-screen rk-not-found">
      <section className="rk-hero">
        <div className="rk-eyebrow">
          <span>404 / 页面未找到</span>
        </div>
        <h1 className="rk-hero-title">
          这页暂时找不到了
        </h1>
        <p className="rk-hero-sub">
          你访问的页面不存在，或已被搬走。回到首页看看？
        </p>
        <div className="rk-hero-actions">
          <Link href="/" className="rk-btn rk-btn-primary">返回首页</Link>
          <Link href="/archive/" className="rk-btn rk-btn-ghost">去归档找找</Link>
        </div>
      </section>
    </div>
  );
}
