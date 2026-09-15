import { migrate } from "payload"
import { parseLastShownAt } from "./popupSchedule"

// LocalStratge にアクセスする操作をまとめる
const KEY = "top-popup-last-shown-at"
export const readLastShownAt = (now: Date): number | null => {
    try{
        const raw = localStorage.getItem(KEY)
        const lastShownAt = parseLastShownAt(raw, now)
        return lastShownAt
    } catch{
        return null
    }
}