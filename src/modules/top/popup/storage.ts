import { parseLastShownAt } from "./popupSchedule";

// localStorage にアクセスする操作をまとめる
const KEY = "top-popup-last-shown-at";

export const readLastShownAt = (now: Date): number | null => {
  try {
    const raw = localStorage.getItem(KEY);
    const lastShownAt = parseLastShownAt(raw, now);
    return lastShownAt;
  } catch {
    return null;
  }
};

export const writeLastShownAt = (at: number): void => {
  try {
    localStorage.setItem(KEY, String(at));
  } catch {
    // 書き込めない場合は記録を諦める
  }
};
