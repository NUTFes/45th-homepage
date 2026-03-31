export default function InfoFrame(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="px-ll">
      <div className="bg-main">
        <div className="gap-y-8 rounded-3xl border-2 border-main bg-base-dark px-m py-ll text-white text-text">
          {children}
        </div>
      </div>
    </div>
  );
}
