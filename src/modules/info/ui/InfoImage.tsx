"use client";

import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

export type InfoImageProps = {
  aspect: string;
  alt: string;
  caption?: string;
  src?: string;
  placeholderTitle?: string;
  placeholderNote?: string;
};

function Placeholder({
  placeholderTitle,
  placeholderNote,
}: Pick<InfoImageProps, "placeholderTitle" | "placeholderNote">) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-base px-m text-center">
      {placeholderTitle ? (
        <p className="font-kaisotai text-[24px] text-main">{placeholderTitle}</p>
      ) : null}
      {placeholderNote ? (
        <p className={placeholderTitle ? "text-text-large text-main" : "text-text text-font-main"}>
          {placeholderNote}
        </p>
      ) : null}
    </div>
  );
}

function ImageBox({
  aspect,
  alt,
  src,
  placeholderTitle,
  placeholderNote,
  fullscreen = false,
}: InfoImageProps & { fullscreen?: boolean }) {
  if (fullscreen && src) {
    return (
      <img
        alt={alt}
        src={src}
        className="max-h-[90vh] max-w-[95vw] border-2 border-main object-contain"
      />
    );
  }

  const sizeClass = fullscreen ? `${aspect} max-h-[85vh] w-[85vw] max-w-250` : `${aspect} w-full`;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border-2 border-main ${sizeClass}`}
    >
      {src ? (
        <img
          alt={alt}
          src={src}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Placeholder placeholderTitle={placeholderTitle} placeholderNote={placeholderNote} />
      )}
    </div>
  );
}

export default function InfoImage(props: InfoImageProps) {
  const { alt, caption } = props;

  return (
    <figure className="flex w-full max-w-200 min-w-0 flex-col gap-ss lg:max-w-none lg:flex-1">
      <div className="flex flex-1 items-center">
        <DialogTrigger>
          <Button
            aria-label={`${caption ?? alt}を全画面で表示`}
            className="w-full cursor-zoom-in outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main"
          >
            <ImageBox {...props} />
          </Button>
          <ModalOverlay
            isDismissable
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-m backdrop-blur-sm entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out"
          >
            <Modal className="outline-none entering:animate-in entering:zoom-in-95 exiting:animate-out exiting:zoom-out-95">
              <Dialog className="outline-none">
                {({ close }) => (
                  <Button
                    aria-label="全画面表示を閉じる"
                    onPress={close}
                    className="cursor-zoom-out outline-none"
                  >
                    <ImageBox {...props} fullscreen />
                  </Button>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </div>
      {caption ? (
        <figcaption className="hidden text-center text-Ptext-large text-font-main lg:block">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
