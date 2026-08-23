import SectionTitle from "@/components/ui/SectionTitle";
import InfoFrame from "@/components/ui/InfoFrame";
import Image from "next/image";
import MapFrame from "@/components/ui/MapFrame";
//import AdCarousel from "@/components/ui/AdCarousel"; ←まだない

function AccessPageMobile() {
  return (
    <div className="flex min-h-screen flex-col gap-y-4l bg-base text-white py-pm">
       
        <div className="gap-y-s">
             <SectionTitle title="アクセス" /> 
             <div className="w-full text-center text-button">大学Googleマップ</div>
            <div className="flex justify-center px-8 py-s">
                <iframe
                className="aspect-4/3 w-full max-w-4xl border-2 border-main"
                src="https://www.google.com/maps?q=%E9%95%B7%E5%B2%A1%E6%8A%80%E8%A1%93%E7%A7%91%E5%AD%A6%E5%A4%A7%E5%AD%A6%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E9%95%B7%E5%B2%A1%E5%B8%82%E4%B8%8A%E5%AF%8C%E5%B2%A1%E7%94%BA1603-1&output=embed"
                title="長岡技術科学大学の Google マップ"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                />
            </div>  
            <div className="w-full text-center text-text">「技大前」バス停からすぐ</div>
        </div>
        <InfoFrame className="flex w-full flex-col text-center gap-y-s px-8">
            <div className="pb-s">
             <SectionTitle title="開催日" />   
            </div>
            <div className="text-button">9月19日（土）　10：00～20：00 </div>
            <div className="text-button">9月20日（日）　10：00～18：30 </div>
            <div className="text-text">※1日目の出店は17：00まで、2日目の出店は16：00までです</div>
        </InfoFrame>

        <div className="flex flex-col gap-y-m">
            <SectionTitle title="シャトルバス時刻表" /> 
            <div className="text-text px-3l">
                <p>技大祭当日は、専用のシャトルバスを運行します。</p>
<p>通常の路線バスとは<span className="text-accent">乗り場が異なります</span>ので、お間違えのないようご注意ください。</p>
<p>乗り場周辺には、技大祭Tシャツを着たスタッフがおりますので、場所がわからない場合はお気軽にお声がけください。</p>
            </div>
            <div className="gap-y-ss text-center justify-center">
                <Image
                    src="/image/access/shuttle_pc.png"
                    alt="シャトルバスの時刻表"
                    width={754}
                    height={598}
                    sizes="100vw"
                    className="mx-auto h-auto w-full max-w-83.5 px-3l md:hidden"
                />
            </div>
            <div className="bg-base-dark flex flex-col gap-y-m py-l">
                <div className=" w-full px-ll flex flex-col gap-y-xs">
                    <div className="underline underline-secondary text-title-small">シャトルバス実施日</div>
                    <div className="text-Ptext-large">2026年9月19日（土）・20日（日）</div>
                </div>
                <div className=" w-full px-ll flex flex-col gap-y-xs">
                    <div className="underline underline-secondary text-title-small">乗り場</div>
                    <div className="text-Ptext-large">長岡駅<span className="text-accent">東口</span>（台町Bバス乗り場）<p className="text-text-small">※ 通常の路線バス乗り場とは異なります</p></div>
                   <div>
                    <Image
                        src="/image/access/map_noriba1_mb.png"
                        alt="乗り場説明1"
                        width={312}
                        height={234}
                        sizes="100vw"
                        className="mx-auto h-auto w-full max-w-125 md:hidden"
                    />
                   </div>
                                      <div>
                    <Image
                        src="/image/access/map_noriba2_mb.png"
                        alt="乗り場説明2"
                        width={313}
                        height={248}
                        sizes="100vw"
                        className="mx-auto h-auto w-full max-w-125 md:hidden"
                    />
                   </div>
                    
                </div>
                
                <div className=" w-full px-ll flex flex-col gap-y-m">
                    <div className="text-text-large">技大前（路線バス乗り場隣）</div>
                    <div>==乗り場説明3の画像==</div>
                    <Image
                        src="/image/access/map_noriba4_mb.png"
                        alt="乗り場説明4"
                        width={313}
                        height={248}
                        sizes="100vw"
                        className="mx-auto h-auto w-full max-w-125 md:hidden"
                    />
                </div>

            </div>
        </div>

        <div className="flex flex-col gap-y-m">
             <SectionTitle title="路線バス時刻表" /> 
             <div className="text-Ptext flex flex-col px-ll ">
                <span>長岡駅-技大前間の通常の路線バスです。</span>
                <span>乗り場は通常の路線バス乗り場となります。</span>
                <span className="text-accent">乗車には運賃430円が必要です。</span>

                <span>お困りの際はお近くの実行委員にお尋ねください。</span>
             </div>
                 <Image
                     src="/image/access/rosen_pc.png"
                     alt="路線バスの時刻表"
                     width={754}
                     height={908}
                     sizes="100vw"
                     className="mx-auto h-auto w-full max-w-83.5 px-3l md:hidden"
                 />

            <div className="text-text flex flex-col px-ll text-center justify-center gap-y-ss">
                <div className="text-text-small">
                    時刻表は令和8年4月1日に改正された「越後交通バス時刻表 長岡駅=大手大橋=希望が丘=技大=ニュータウン・県立歴史博物館線」を基に作成されています。
                </div>
             </div>
        </div>
         <div className="flex flex-col gap-y-m">
             <SectionTitle title="駐車場について" /> 
            <div className="text-text flex flex-col px-ll text-center justify-center gap-y-ss">
                <MapFrame />
                <div className="text-text">
                    <b>駐車場には限りがございます。</b>当日は大変な混雑が予想されますので、できるだけ公共交通機関をご利用くださいますようお願いいたします。
                    また、近隣住民の皆様のご迷惑となりますので、<span className="text-accent">路上駐車はご遠慮ください。</span>

                    ご協力をお願いいたします。
                </div>
            </div>

        </div>
    </div>
  );
}

function AccessPageDesktop() {
    return (
        <div className="flex flex-col gap-y-pm bg-base py-4l text-white">
            <div className="px-pl">
                          <SectionTitle title="アクセス" />   
                    </div>    
            <div className="mx-auto flex flex-col w-full max-w-200 justify-center gap-y-4l">    
                <div className="flex flex-col gap-y-s">
                        <div className="w-full text-center text-Ptext">大学Googleマップ</div>
                    <div className="flex justify-center">
                        <iframe
                            className="aspect-4/3 w-full border-2 border-main"
                            src="https://www.google.com/maps?q=%E9%95%B7%E5%B2%A1%E6%8A%80%E8%A1%93%E7%A7%91%E5%AD%A6%E5%A4%A7%E5%AD%A6%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E9%95%B7%E5%B2%A1%E5%B8%82%E4%B8%8A%E5%AF%8C%E5%B2%A1%E7%94%BA1603-1&output=embed"
                            title="長岡技術科学大学の Google マップ"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                    </div>
                    <div className="w-full text-center text-text">「技大前」バス停からすぐ</div>
                 <InfoFrame className="flex flex-col text-center gap-y-s px-4l ">
                    <div className="pb-s">
                    <SectionTitle title="開催日" />   
                    </div>
                    <div className="text-button">9月19日（土）　10：00～20：00 </div>
                    <div className="text-button">9月20日（日）　10：00～18：30 </div>
                    <div className="text-text">※1日目の出店は17：00まで、2日目の出店は16：00までです</div>
                </InfoFrame>
                </div>
                
               
            </div>


            <div className="flex flex-col gap-y-m">
                <div className="px-pl">
                    <SectionTitle title="シャトルバス時刻表" />
                </div>
                <div className="text-Ptext  px-pll ">
                    <p>技大祭当日は、専用のシャトルバスを運行します。</p>
                    <p>通常の路線バスとは<span className="text-accent">乗り場が異なります</span>ので、お間違えのないようご注意ください。</p>
                    <p>乗り場周辺には、技大祭Tシャツを着たスタッフがおりますので、場所がわからない場合はお気軽にお声がけください。</p>
                </div>
                <Image
                    src="/image/access/shuttle_pc.png"
                    alt="シャトルバスの時刻表"
                      width={754}
                      height={598}
                    sizes="100vw"
                    className="mx-auto h-auto w-full max-w-188.5"
                />
                
            </div>
                <div className="bg-base-dark flex flex-col gap-y-m py-l">
                    <div className="flex w-full flex-col gap-y-xs px-pll">
                        <div className="underline underline-secondary text-Ptitle-small">シャトルバス実施日</div>
                        <div className="text-Ptext-large">2026年9月19日（土）・20日（日）</div>
                    </div>
                    <div className="flex w-full flex-col gap-y-xs px-pll">
                        <div className="underline underline-secondary text-Ptitle-small">乗り場</div>
                        <div className="text-Ptext-large">長岡駅<span className="text-accent">東口</span>（台町Bバス乗り場）<p className="text-text-small">※ 通常の路線バス乗り場とは異なります</p></div>
                        <div className="flex flex-col gap-y-m lg:flex-row lg:justify-center lg:gap-x-m">
                            <Image src="/image/access/map_noriba1_mb.png" alt="乗り場説明1" width={312} height={234} sizes="50vw" className="h-auto w-full min-w-95 max-w-95 self-center lg:aspect-4/3 lg:w-1/2 lg:object-contain xl:max-w-125" />
                            <Image src="/image/access/map_noriba2_mb.png" alt="乗り場説明2" width={313} height={248} sizes="50vw" className="h-auto w-full min-w-95 max-w-95 self-center lg:aspect-4/3 lg:w-1/2 lg:object-contain xl:max-w-125" />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-y-m px-pll">
                        <div className="text-text-large">技大前（路線バス乗り場隣）</div>
                        <div>==乗り場説明3の画像==</div>
                        <Image src="/image/access/map_noriba4_mb.png" alt="乗り場説明4" width={313} height={248} sizes="50vw" className="h-auto w-full min-w-95 max-w-95 self-center xl:max-w-125" />
                    </div>
                </div>
            <div className="flex flex-col gap-y-m">
                <div className="px-pl">
                    <SectionTitle title="路線バス時刻表" />
                </div>
                <div className="flex flex-col px-pll text-Ptext">
                    <span>長岡駅-技大前間の通常の路線バスです。</span>
                    <span>乗り場は通常の路線バス乗り場となります。</span>
                    <span className="text-accent">乗車には運賃430円が必要です。</span>
                    <span>お困りの際はお近くの実行委員にお尋ねください。</span>
                </div>
                <Image src="/image/access/rosen_pc.png" alt="路線バスの時刻表" width={754} height={908} sizes="100vw" className="mx-auto h-auto w-full max-w-188.5" />
                <div className="flex justify-center gap-y-ss px-pll text-center text-text">
                    <div className="text-text-small">時刻表は令和8年4月1日に改正された「越後交通バス時刻表 長岡駅=大手大橋=希望が丘=技大=ニュータウン・県立歴史博物館線」を基に作成されています。</div>
                </div>
            </div>

            <div className="flex flex-col gap-y-m">
                <div className="px-pl">
                    <SectionTitle title="駐車場について" />
                </div>
                <div className="flex flex-col justify-center gap-y-ss px-pll text-center text-Ptext">
                    <MapFrame />
                    <div>
                        <b>駐車場には限りがございます。</b>当日は大変な混雑が予想されますので、できるだけ公共交通機関をご利用くださいますようお願いいたします。
                        また、近隣住民の皆様のご迷惑となりますので、<span className="text-accent">路上駐車はご遠慮ください。</span>
                        ご協力をお願いいたします。
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AccessPageView() {
    return (
        <>
            <div className="md:hidden">
                <AccessPageMobile />
            </div>
            <AccessPageDesktop />
        </>
    );
}