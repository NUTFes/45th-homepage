export type ContactSectionProps = {
  title?: string;
  body?: string;
};

export default function ContactSection({ title, body }: ContactSectionProps) {
    return (
        <div> {/*企画のタイトル・本文統合要素*/}
            <div> {/*タイトル要素*/}
                <div> {/*タイトル下のボーダー*/}
                    <p>{title}</p>
                </div>
            </div>
            <div> {/*本文要素*/}
                <p>{body}</p>
            </div>
        </div>
    )
}