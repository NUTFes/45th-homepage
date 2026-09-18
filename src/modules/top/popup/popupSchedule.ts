// 何時から何時の間に一回表示するのかをまとめる
export const POPUP_WINDOWS = [
  { start: 11, end: 16 }, // 1回目
  { start: 16, end: 27 }, // 27 時は、翌３時
] as const;

// 日付をまたぐ区間のための、24以上の時間表記を定数から算出
const MAX_HOURS = Math.max(...POPUP_WINDOWS.map((w) => w.end));
const BORDER_HOURS = Math.max(MAX_HOURS - 24, 0);

// 今が、上記で定義した区間のどれに属するか、その区間の開始時間を計算する
export const nowWindowStart = (now: Date): number | null => {
  // 純粋な現時刻を取得(現時点では、国内のみ想定で実装)
  const h = now.getHours();
  // 24以上の時間を使うかどうかのフラグ(Yes の場合は日付を昨日として扱う)
  const isYesterday: boolean = h <= BORDER_HOURS;
  // 27時の判定を入れるため、3時以下の場合は24を加算する
  const nowHours = isYesterday ? h + 24 : h;

  // 絶対時刻に変換する関数
  const hours2Abstime = (hour: number): number => {
    const d = new Date(now); //次の行の操作でそのまま now を使うと、大本の Date 自体が書き換わるため、今の Date をコピー
    if (isYesterday) d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);

    return d.getTime() + hour * 60 * 60 * 1000;
  };

  // 各区間に対して、属するかの検証
  for (const pWindow of POPUP_WINDOWS) {
    if (nowHours >= pWindow.start && nowHours < pWindow.end) {
      return hours2Abstime(pWindow.start);
    }
  }

  return null;
};

// ポップアップ自体を表示する日付の範囲(この2日を含む)。単年開催のため固定値。
const ACTIVE_PERIOD_START_DATE = "2026-09-19";
const ACTIVE_PERIOD_END_DATE = "2026-09-26";

// Date を "YYYY-MM-DD" の文字列に変換する(ローカル時刻基準)
const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 区間の開始時刻が、表示対象の日付範囲に入っているか。
// now の生の日付ではなく区間の開始時刻の日付で見ることで、日をまたぐ区間
// (例: 9/26 16時〜翌3時)の末尾が正しく 9/26 側の扱いになる。
const isWithinActivePeriod = (windowStart: number): boolean => {
  const dateKey = toDateKey(new Date(windowStart));
  return ACTIVE_PERIOD_START_DATE <= dateKey && dateKey <= ACTIVE_PERIOD_END_DATE;
};

// 今回ポップアップを表示するべきか？ bool を返す関数
export const shouldShow = (now: Date, lastShownAt: number | null): boolean => {
  const start = nowWindowStart(now);
  if (start === null || !isWithinActivePeriod(start)) return false;
  return lastShownAt === null || lastShownAt < start;
};

// ローカルストレージに書かれている、前回いつポップアップを表示したかという情報を正規化して、ありえない数値を「記録なし(null)」として変換する
export const parseLastShownAt = (raw: string | null, now: Date): number | null => {
  if (raw === null) return null;
  let numRaw = Number(raw);
  if (Number.isNaN(numRaw)) return null;
  if (numRaw < 0 || now.getTime() < numRaw) return null;
  return numRaw;
};
