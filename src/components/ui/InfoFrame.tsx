export default function InfoFrame(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="px-ll">
      <div className="bg-main">
        <div className="rounded-3xl border-2 border-main bg-base-dark px-m py-ll text-text text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
