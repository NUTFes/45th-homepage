// 何時から何時の間に一回表示するのかをまとめる
export const POPUP_WINODWS = [
    {start: 11, end: 16}, // 1回目
    {start: 16, end: 27}, // 27 時は、翌３時
]

// 今が、上記で定義した区間のどれに属するか、その区間の開始時間を計算する
const nowWindowStart = (now: Date): number | null => {
    // 27時の判定を入れるため、3時以下の場合は24を加算する
    const nowHours = now.getHours() <= 3 ? now.getHours() + 24 : now.getHours();

    // 各区間に対して、属するかの検証
    for(let pWindow of POPUP_WINODWS){
        if(nowHours >= pWindow.start && nowHours < pWindow.end){
            return pWindow.start; 
        }
    }

    return null;
}