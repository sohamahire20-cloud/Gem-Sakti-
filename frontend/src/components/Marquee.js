export default function Marquee() {
  const items = ["ENERGY", "FAITH", "PROSPERITY"];
  const Row = ({ hidden }) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-8 font-display text-4xl italic text-ivory/90 sm:text-6xl lg:text-7xl">{w}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-gold" fill="currentColor" aria-hidden>
            <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <section className="overflow-hidden border-b border-ivory/10 bg-ink py-8">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
