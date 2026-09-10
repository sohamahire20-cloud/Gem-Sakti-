import Quiz from "../components/Quiz";
import useSEO from "../hooks/useSEO";

export default function QuizPage() {
  useSEO({
    title: "Find Your GemSakti — Discovery Quiz",
    description: "Three quiet questions — intention, style, budget — and we suggest the pieces that match.",
  });
  return (
    <main className="bg-ink2 pb-24 pt-12 lg:pt-20" data-testid="quiz-page">
      <div className="container-gs grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Find your GemSakti</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-6xl">
            Not sure where to begin? Let us guide you.
          </h1>
          <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-ivory/55">
            Answer three simple questions and we will suggest up to three pieces from the collection —
            chosen for your intention, the style you like to wear and your budget.
          </p>
        </div>
        <div className="lg:col-span-7">
          <Quiz />
        </div>
      </div>
    </main>
  );
}
