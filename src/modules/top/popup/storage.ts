import { parseLastShownAt, shouldShow } from "./popupSchedule";

// localStorage にアクセスする操作をまとめる
const KEY = "top-popup-last-shown-at";

// 前回の表示記録を読み、表示すべきか判定し、表示するならその場で記録する。
// 読み書きのどこかで例外が起きても「表示しない」に倒す(毎回表示より害が小さい)。
export const resolvePopupVisibility = (now: Date): boolean => {
  try {
    const raw = localStorage.getItem(KEY);
    const lastShownAt = parseLastShownAt(raw, now);

    if (!shouldShow(now, lastShownAt)) return false;

    localStorage.setItem(KEY, String(now.getTime()));
    return true;
  } catch {
    return false;
  }
};
