"use client";

import Script from "next/script";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { TURNSTILE_ACTION } from "../constants";

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  "timeout-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileWidgetHandle = {
  reset: () => void;
};

type TurnstileWidgetProps = {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  onError?: () => void;
};

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onTokenChange, onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    const clearToken = useCallback(() => {
      onTokenChange(null);
    }, [onTokenChange]);

    const reportError = useCallback(() => {
      clearToken();
      onError?.();
    }, [clearToken, onError]);

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: TURNSTILE_ACTION,
        callback: (token) => onTokenChange(token),
        "expired-callback": clearToken,
        "error-callback": reportError,
        "timeout-callback": clearToken,
      });
    }, [clearToken, onTokenChange, reportError, siteKey]);

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          clearToken();
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
      }),
      [clearToken],
    );

    useEffect(
      () => () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      },
      [],
    );

    return (
      <>
        <div ref={containerRef} />
        <Script
          id="cloudflare-turnstile"
          src={TURNSTILE_SCRIPT_URL}
          strategy="afterInteractive"
          onReady={renderWidget}
          onError={reportError}
        />
      </>
    );
  },
);

export default TurnstileWidget;
