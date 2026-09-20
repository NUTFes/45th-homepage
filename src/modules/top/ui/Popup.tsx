"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

import ButtonMain from "@/components/ui/ButtonMain";

type PopupProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  surveyHref: string;
};

export default function Popup({ isOpen, onOpenChange, surveyHref }: PopupProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-400 flex min-h-dvh items-center justify-center overflow-y-auto bg-base/60 px-m py-m md:px-3l md:py-3l xl:px-[390px] entering:duration-200 entering:ease-out entering:animate-in entering:fade-in exiting:duration-150 exiting:ease-in exiting:animate-out exiting:fade-out"
    >
      <Modal className="relative w-full max-w-84 outline-none md:max-w-200 entering:duration-200 entering:ease-out entering:animate-in entering:zoom-in-95 exiting:duration-150 exiting:ease-in exiting:animate-out exiting:zoom-out-95">
        <Dialog className="relative max-h-[calc(100dvh-var(--spacing-3l))] rounded-2xl border-8 border-main bg-timetable-base-dark text-font-main shadow-[0_0_8px_rgba(60,224,232,0.7)] outline-none">
          {({ close }) => (
            <>
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
                <Image
                  src="/image/greeting/45th-logo-touka.svg"
                  alt=""
                  aria-hidden="true"
                  width={265}
                  height={265}
                  className="absolute -top-10 -right-10 size-40 opacity-90 mix-blend-screen md:-top-20 md:-right-20 md:size-80"
                />
              </div>

              <Button
                onPress={close}
                aria-label="閉じる"
                className="absolute -top-10 right-ss z-10 flex size-8 items-center justify-center bg-timetable-base-dark text-font-gray outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main md:-top-12 md:right-ss md:size-10"
              >
                <XIcon
                  strokeWidth={2}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  className="size-ll md:size-3l"
                />
              </Button>

              <div className="max-h-[calc(100dvh-56px)] overflow-y-auto px-m pt-ll pb-l md:max-h-[calc(100dvh-var(--spacing-5l))] md:px-3l md:py-3l">
                <Heading
                  slot="title"
                  className="text-center text-title-small leading-7 font-bold text-font-main md:text-Ptitle-small md:leading-8"
                >
                  <span className="block">アンケートへのご協力を</span>
                  <span className="block">お願いいたします！ (3~5分)</span>
                </Heading>

                <div className="mt-l flex flex-col gap-m text-text text-font-main md:mt-ll md:gap-l md:text-Ptext">
                  <p>
                    第45回技大祭にご来場いただき、誠にありがとうございます！
                    <br />
                    今後の運営改善の参考にさせていただくため、アンケートにご協力をお願いいたします。
                  </p>
                  <p>
                    アンケートにご回答いただいた方の中から、抽選で20名様に
                    <strong className="font-bold text-accent underline underline-offset-2">
                      Amazonギフトカード500円分
                    </strong>
                    をプレゼント！
                  </p>
                </div>

                <div className="mt-s flex w-full justify-center md:mt-l [&>a]:w-full [&>a]:max-w-55 [&>a]:px-s md:[&>a]:max-w-75 md:[&>a]:px-3l">
                  <ButtonMain
                    href={surveyHref}
                    title="アンケートはこちらから"
                    arrow={false}
                    newTab
                  />
                </div>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
