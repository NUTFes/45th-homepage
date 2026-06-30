import EventInfoCard from "@/components/ui/EventInfoCard";

export default function StickyTestPage() {
  return (
    <>
      <div className="md:flex">
        <main className="min-w-0 flex-1 space-y-6 border-b border-base-dark bg-base px-8 pt-8 pb-8 md:pt-5l">
          <h1 className="text-2xl font-bold text-font-main">企画</h1>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-blue-950 p-6">
              <h2 className="mb-2 font-bold text-secondary">セクション {i + 1}</h2>
              <p className="leading-relaxed text-font-main">企画のコンテンツがここに入ります。</p>
            </div>
          ))}
        </main>
        <div className="md:w-[491px] md:shrink-0">
          <EventInfoCard location="体育館" title="キッチンカーエリア" imageSrc="" />
        </div>
      </div>
      <section className="flex flex-col items-center gap-6 bg-base px-8 py-16">
        <h2 className="text-xl font-bold text-font-main">企業広告エリア</h2>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex h-32 w-full max-w-2xl items-center justify-center rounded-lg bg-base-dark text-secondary"
          >
            AD
          </div>
        ))}
      </section>
    </>
  );
}
