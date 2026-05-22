export default function InfoFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="bg-main shadow-[0px_0px_8px_0px_#111d53]">
        <div className="rounded-3xl border-2 border-main bg-base-dark px-m py-ll text-text text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
