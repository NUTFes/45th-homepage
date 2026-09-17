import { parseLastShownAt } from "./popupSchedule";

// localStorage にアクセスする操作をまとめる
const KEY = "top-popup-last-shown-at";
const AVAILABILITY_PROBE_KEY = "top-popup-storage-probe";

// 書き込みが本当に機能するかを確認する。読み書きが失敗する環境では、
// 「記録なし」と区別が付かず毎回表示になってしまうため、呼び出し側で
// 事前に確認してポップアップ自体を出さない判断に使う。
export const isStorageAvailable = (): boolean => {
  try {
    localStorage.setItem(AVAILABILITY_PROBE_KEY, "1");
    localStorage.removeItem(AVAILABILITY_PROBE_KEY);
    return true;
  } catch {
    return false;
  }
};

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
