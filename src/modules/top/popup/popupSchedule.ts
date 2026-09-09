// 何時から何時の間に一回表示するのかをまとめる
export const POPUP_WINODWS = [
    {start: 11, end: 16}, // 1回目
    {start: 16, end: 27}, // 27 時は、翌３時
]

// 今が、上記で定義した区間のどれに属するか、その区間の開始時間を計算する
const nowWindowStart = (now: Date): number | null => {
    const nowHours = now.getHours();
    for(let pWindow of POPUP_WINODWS){
        if(nowHours >= pWindow.start && nowHours < pWindow.end){
            return pWindow.start; 
        }
    }

    return null;
}