// 何時から何時の間に一回表示するのかをまとめる
export const POPUP_WINODWS = [
    {start: 11, end: 16}, // 1回目
    {start: 16, end: 27}, // 27 時は、翌３時
]

// 今が、上記で定義した区間のどれに属するか、その区間の開始時間を計算する
const nowWindowStart = (now: Date): number | null => {
    // 純粋な現時刻を取得
    const h = now.getHours();
    // 3時以前かどうかのフラグ(Yes の場合は日付を昨日として扱う)
    const isYesterday:boolean = h <= 3 ;
    // 27時の判定を入れるため、3時以下の場合は24を加算する
    const nowHours = isYesterday ? h + 24 : h;

    
    // 絶対時刻に変換する関数
    const hours2Abstime = (hour: number) : number => {
        const d = new Date(now); //次の行の操作でそのまま now を使うと、大本の Date 自体が書き換わるため、今の Date をコピー 
        isYesterday && d.setDate(d.getDate() -1);
        d.setHours(0, 0, 0, 0);

        return d.getTime() + hour * 60 * 60 * 1000;
    }
    
    // 各区間に対して、属するかの検証
    for(const pWindow of POPUP_WINODWS){
        if(nowHours >= pWindow.start && nowHours < pWindow.end){
            return hours2Abstime(pWindow.start); 
        }
    }

    return null;
}