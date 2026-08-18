export type TicketDistributionInfoProps = {
  title?: string;
  statusText: string;
};

export default function TicketDistributionInfo({
  title = "整理券配布情報",
  statusText,
}: TicketDistributionInfoProps) {
  return (
    <section
      aria-labelledby="ticket-distribution-title"
      className="flex w-full flex-col items-center border-y-[1.4px] border-main bg-[#1b2d7b] px-3l py-l shadow-[0_2px_6px_0_#111d53] max-[360px]:px-6"
    >
      <div className="flex w-full flex-col items-start gap-0.5 font-sans wrap-anywhere [word-break:break-word] text-white">
        <h2
          id="ticket-distribution-title"
          className="m-0 w-full text-[16px]/[23px] font-bold tracking-normal"
        >
          {title}
        </h2>
        <p className="m-0 w-full text-[16px]/[22px] font-medium tracking-normal whitespace-pre-line">
          {statusText}
        </p>
      </div>
    </section>
  );
}
