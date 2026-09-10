import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../components/motion/Reveal";
import { JOURNAL } from "../data/journal";
import useSEO from "../hooks/useSEO";

export default function JournalPostPage() {
  const { slug } = useParams();
  const post = JOURNAL.find((p) => p.slug === slug);

  useSEO({
    title: post ? `${post.title} — GemSakti Journal` : "Journal — GemSakti",
    description: post?.excerpt,
  });

  if (!post) {
    return (
      <main className="bg-ink py-32 text-center" data-testid="journal-post-not-found">
        <h1 className="font-display text-4xl text-ivory">That story has moved.</h1>
        <Link to="/journal" className="btn-gold mt-8" data-testid="journal-back-link">
          Back to the journal
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-ink pb-24 pt-10 lg:pt-16" data-testid="journal-post-page">
      <article className="container-gs max-w-3xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-wider2 text-ivory/40">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight size={11} />
          <Link to="/journal" className="hover:text-gold">Journal</Link>
        </nav>
        <Reveal>
          <h1 className="mt-8 font-display text-4xl leading-tight text-ivory sm:text-6xl">{post.title}</h1>
          <p className="mt-5 text-base italic leading-relaxed text-ivory/55">{post.excerpt}</p>
        </Reveal>
        <div className="mt-12 space-y-8 border-t border-ivory/10 pt-12">
          {post.body.map((block, i) =>
            block.h ? (
              <Reveal key={i}>
                <h2 className="font-display text-2xl text-gold sm:text-3xl">{block.h}</h2>
              </Reveal>
            ) : (
              <Reveal key={i}>
                <p className="text-[15px] leading-[1.9] text-ivory/70">{block.p}</p>
              </Reveal>
            )
          )}
        </div>
        <div className="mt-16 border border-ivory/10 bg-ink2 p-8 text-center sm:p-10">
          <p className="font-display text-2xl text-ivory">Ready to find your piece?</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" data-testid="journal-post-shop-cta" className="btn-gold">
              Shop the collection
            </Link>
            <Link to="/quiz" data-testid="journal-post-quiz-cta" className="btn-outline">
              Take the quiz
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
