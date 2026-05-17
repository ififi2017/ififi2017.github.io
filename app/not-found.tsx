import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rk-screen">
      <section className="rk-hero" style={{ paddingTop: 64 }}>
        <div className="rk-eyebrow">
          <span className="rk-eyebrow-dot" />
          <span>404 · NOT FOUND</span>
        </div>
        <h1 className="rk-hero-title">
          这里 <em>什么</em> 都没有。
        </h1>
        <p className="rk-hero-sub">
          你访问的页面不存在，或已被搬走。回到首页看看？
        </p>
        <div className="rk-hero-actions">
          <Link href="/" className="rk-btn rk-btn-primary">返回首页 →</Link>
        </div>
      </section>
    </div>
  );
}
