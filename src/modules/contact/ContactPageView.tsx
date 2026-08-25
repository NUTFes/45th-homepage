"use client";

import Image from "next/image";
import { type FormEvent, useCallback, useRef, useState } from "react";
import { Button } from "@/components/aria/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import { CONTACT_FIELD_MAX_LENGTHS, GENDER_OPTIONS, INQUIRY_TYPE_OPTIONS } from "./constants";
import ContactAccordionSection from "./ui/ContactAccordionSection";
import ContactSection from "./ui/ContactSection";
import TurnstileWidget, { type TurnstileWidgetHandle } from "./ui/TurnstileWidget";
import type { ContactFormValues } from "./types";
import { useContactForm } from "./useContactForm";
import { validateContactForm } from "./validation";

const DEFAULT_VALUES = {
  name: "",
  kana: "",
  gender: "",
  age: "",
  region: "",
  email: "",
  phone: "",
  inquiryType: "",
  inquiry: "",
} as const;

const CONTACT_SEND_FAILURE_MESSAGE = "送信に失敗しました。時間をおいて再度お試しください。";
const CONTACT_UNAVAILABLE_MESSAGE =
  "現在お問い合わせを送信できません。時間をおいて再度お試しください。";
const CONTACT_SUCCESS_MESSAGE = "お問い合わせを送信しました。";

type ContactPageViewProps = {
  siteKey?: string;
};

type SubmissionState =
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | null;

const readApiErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      return body.message;
    }
  } catch {
    // Fall back to the fixed message below when the response is not JSON.
  }

  return CONTACT_SEND_FAILURE_MESSAGE;
};

export default function ContactPageView({ siteKey }: ContactPageViewProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const submitContact = useCallback(
    async (values: ContactFormValues) => {
      if (!turnstileToken) {
        throw new Error("認証を完了してください");
      }

      try {
        let response: Response;
        try {
          response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ values, turnstileToken }),
          });
        } catch {
          throw new Error(CONTACT_SEND_FAILURE_MESSAGE);
        }

        if (!response.ok) {
          throw new Error(await readApiErrorMessage(response));
        }
      } finally {
        turnstileRef.current?.reset();
      }
    },
    [turnstileToken],
  );

  const { errors, handleSubmit, isSubmitting, register, reset } = useContactForm({
    defaultValues: DEFAULT_VALUES,
    validate: validateContactForm,
    onSubmit: submitContact,
  });

  const handleTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) {
      setTurnstileError(false);
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      setSubmissionState(null);

      const result = await handleSubmit(event);

      if (result.ok) {
        reset();
        setSubmissionState({ kind: "success", message: CONTACT_SUCCESS_MESSAGE });
        return;
      }

      setSubmissionState({ kind: "error", message: result.error });
    },
    [handleSubmit, reset],
  );

  const turnstileUnavailable = !siteKey || turnstileError;

  return (
    <div className="relative min-h-screen overflow-hidden bg-base">
      <Image
        src="/image/PageBack1.svg"
        alt=""
        aria-hidden="true"
        width={287}
        height={333}
        className="pointer-events-none absolute top-0 right-0 z-0 hidden md:block"
      />
      <Image
        src="/image/PageBack2.svg"
        alt=""
        aria-hidden="true"
        width={243}
        height={644}
        className="pointer-events-none absolute bottom-20 left-0 z-0 hidden md:block"
      />

      <div className="relative z-20 mx-auto flex w-full flex-col gap-4l py-4l md:gap-3l md:pt-5l md:pb-pm">
        <section className="flex flex-col gap-s md:gap-ll">
          <div className="md:px-pl">
            <SectionTitle title="お問い合わせ" />
          </div>
          <div className="px-ll md:mx-auto md:w-full md:max-w-200 md:px-0">
            <p className="text-text whitespace-pre-line text-font-main md:text-Ptext">
              下記フォーマットにご記入いただき、「送信」ボタンより送信ください。1週間以内に担当者よりご連絡させていただきます。
              {"\n\n"}
              また、お問い合わせの内容（広告・勧誘・ご紹介など）によってはお返事を差し上げられない場合がございます。あらかじめご了承ください。
            </p>
          </div>
        </section>

        <form
          noValidate
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col gap-l md:mx-auto md:max-w-200 md:gap-3l"
        >
          <ContactSection
            label="お名前"
            name="name"
            required
            placeholder="技大　太郎"
            autoComplete="name"
            maxLength={CONTACT_FIELD_MAX_LENGTHS.name}
            error={errors.name}
            {...register("name")}
          />
          <ContactSection
            label="ふりがな"
            name="kana"
            required
            placeholder="ぎだい　たろう"
            autoComplete="off"
            maxLength={CONTACT_FIELD_MAX_LENGTHS.kana}
            error={errors.kana}
            {...register("kana")}
          />
          <ContactAccordionSection
            label="性別"
            name="gender"
            options={GENDER_OPTIONS}
            placeholder="未選択"
            error={errors.gender}
            {...register("gender")}
          />
          <ContactSection
            label="年齢"
            name="age"
            placeholder="半角数字"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={CONTACT_FIELD_MAX_LENGTHS.age}
            error={errors.age}
            {...register("age")}
          />
          <ContactSection
            label="お住まいの地域"
            name="region"
            placeholder="新潟県長岡市"
            autoComplete="address-level2"
            maxLength={CONTACT_FIELD_MAX_LENGTHS.region}
            error={errors.region}
            {...register("region")}
          />
          <ContactSection
            label="メールアドレス"
            name="email"
            required
            type="email"
            placeholder="nutfes@gmail.com"
            inputMode="email"
            autoComplete="email"
            maxLength={CONTACT_FIELD_MAX_LENGTHS.email}
            error={errors.email}
            {...register("email")}
          />
          <ContactSection
            label="電話番号"
            name="phone"
            type="tel"
            placeholder="ハイフンなし数字のみ"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="tel"
            maxLength={CONTACT_FIELD_MAX_LENGTHS.phone}
            error={errors.phone}
            {...register("phone")}
          />
          <ContactAccordionSection
            label="お問い合わせ項目"
            name="inquiryType"
            required
            options={INQUIRY_TYPE_OPTIONS}
            placeholder="未選択"
            error={errors.inquiryType}
            {...register("inquiryType")}
          />
          <ContactSection
            label="お問い合わせ内容"
            name="inquiry"
            required
            type="textarea"
            rows={5}
            maxLength={CONTACT_FIELD_MAX_LENGTHS.inquiry}
            className="[&_textarea]:h-pl"
            error={errors.inquiry}
            {...register("inquiry")}
          />

          <div className="flex flex-col items-center gap-s pt-ss md:pt-0">
            {siteKey && (
              <TurnstileWidget
                ref={turnstileRef}
                siteKey={siteKey}
                onTokenChange={handleTokenChange}
                onError={() => setTurnstileError(true)}
              />
            )}

            {turnstileUnavailable && (
              <p role="alert" className="px-ll text-center text-button text-required">
                {CONTACT_UNAVAILABLE_MESSAGE}
              </p>
            )}

            {submissionState && (
              <p
                role={submissionState.kind === "error" ? "alert" : "status"}
                className={
                  submissionState.kind === "error"
                    ? "px-ll text-center text-button text-required"
                    : "px-ll text-center text-button text-white"
                }
              >
                {submissionState.message}
              </p>
            )}

            <Button
              type="submit"
              variant="cta"
              isPending={isSubmitting}
              isDisabled={turnstileUnavailable || !turnstileToken}
            >
              送信
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
