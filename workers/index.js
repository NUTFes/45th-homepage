const maintenancePage = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#18247a" />

    <title>メンテナンス中 | 第45回 技大祭</title>

    <style>
      :root {
        color-scheme: dark;

        --blue-deep: #10195d;
        --blue: #18247a;
        --cyan: #a9e9ef;
        --ice: #eafbfc;
        --white: #ffffff;

        --text-main: rgb(255 255 255 / 90%);
        --text-sub: rgb(255 255 255 / 78%);
        --text-muted: rgb(255 255 255 / 52%);

        --rule: rgb(169 233 239 / 20%);
        --grid: rgb(169 233 239 / 5%);

        font-family:
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Yu Gothic",
          "Meiryo",
          system-ui,
          sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      html {
        background: var(--blue);
      }

      body {
        position: relative;
        display: grid;
        min-height: 100svh;
        margin: 0;
        padding: clamp(24px, 5vw, 56px);
        overflow-x: hidden;
        place-items: center;
        color: var(--white);

        /* 日本語の不自然な句読点改行を抑制 */
        line-break: strict;
      }

      body::before {
        position: fixed;
        z-index: 0;
        inset: 0;
        pointer-events: none;
        content: "";
      }

      p,
      h1 {
        margin: 0;
      }

      main {
        position: relative;
        z-index: 1;
        width: min(100%, 900px);
      }

      .masthead {
        display: flex;
        gap: 24px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: clamp(72px, 10vw, 120px);
        padding-bottom: 15px;
        border-bottom: 1px solid var(--rule);
      }

      .event-name,
      .status,
      .kicker,
      .date-label,
      .theme-label {
        font-family:
          ui-monospace,
          "SFMono-Regular",
          "Cascadia Code",
          "Roboto Mono",
          Consolas,
          monospace;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
      }

      .event-name {
        color: var(--ice);
      }

      .status {
        flex: none;
        color: var(--cyan);
        white-space: nowrap;
      }

      .notice {
        width: min(100%, 720px);
      }

      .kicker {
        margin-bottom: 20px;
        color: var(--cyan);
      }

      h1 {
        max-width: 11em;
        font-size: clamp(2.5rem, 6.5vw, 4.5rem);
        font-weight: 800;
        line-height: 1.28;
        letter-spacing: -0.04em;
      }

      .title-line {
        display: block;
      }

      .title-main {
        white-space: nowrap;
      }

      .message {
        max-width: 42rem;
        margin-top: 34px;
        color: var(--text-main);
        font-size: clamp(1rem, 1.5vw, 1.0625rem);
        line-height: 2;
      }

      .date {
        margin-top: 52px;
      }

      .date-label {
        margin-bottom: 18px;
        color: var(--cyan);
      }

      .date-value {
        display: flex;
        gap: clamp(16px, 3vw, 26px);
        align-items: baseline;
        flex-wrap: wrap;
      }

      .date-value time {
        display: inline-flex;
        gap: 10px;
        align-items: baseline;
        white-space: nowrap;
      }

      .date-number {
        font-family:
          Arial,
          Helvetica,
          sans-serif;
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.045em;
      }

      .date-day {
        color: var(--cyan);
        font-family:
          ui-monospace,
          "SFMono-Regular",
          "Cascadia Code",
          Consolas,
          monospace;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      .date-separator {
        flex: none;
        width: 24px;
        height: 1px;
        align-self: center;
        background: rgb(169 233 239 / 45%);
      }

      .closing {
        max-width: 42rem;
        margin-top: 42px;
        color: var(--text-sub);
        font-size: 0.9375rem;
        line-height: 1.9;
      }

      .closing-action {
        white-space: nowrap;
      }

      .footer {
        display: flex;
        gap: 20px;
        align-items: baseline;
        justify-content: space-between;
        margin-top: clamp(76px, 11vw, 128px);
        padding-top: 17px;
        border-top: 1px solid var(--rule);
      }

      .theme-label {
        color: var(--text-muted);
      }

      .theme {
        color: var(--ice);
        font-size: clamp(0.875rem, 2vw, 1rem);
        font-weight: 700;
        letter-spacing: 0.04em;
      }

      @media (max-width: 680px) {
        body {
          padding: 24px 20px 30px;
        }

        .masthead {
          margin-bottom: 68px;
        }

        .notice {
          width: 100%;
        }

        h1 {
          max-width: none;
          font-size: clamp(1.85rem, 9.3vw, 2.6rem);
          line-height: 1.28;
        }

        .message {
          margin-top: 28px;
        }

        .desktop-break {
          display: none;
        }

        .date {
          margin-top: 42px;
        }

        .date-value {
          gap: 12px;
        }

        .date-separator {
          display: none;
        }

        .date-value time {
          width: 100%;
        }

        .closing {
          margin-top: 38px;
        }

        .footer {
          display: block;
          margin-top: 68px;
        }

        .theme {
          margin-top: 8px;
        }
      }

      @media (max-width: 380px) {
        body {
          padding-right: 18px;
          padding-left: 18px;
        }

        .masthead {
          gap: 12px;
        }

        .event-name,
        .status,
        .kicker,
        .date-label,
        .theme-label,
        .date-day {
          font-size: 0.6875rem;
        }

        h1 {
          font-size: clamp(1.75rem, 9.1vw, 2.15rem);
        }

        .message {
          font-size: 0.9375rem;
        }

        .date-number {
          font-size: 2.1rem;
        }

        .closing {
          font-size: 0.875rem;
        }
      }

      @media (max-width: 320px) {
        body {
          padding-right: 16px;
          padding-left: 16px;
        }

        h1 {
          font-size: 1.7rem;
        }

        .masthead {
          gap: 8px;
        }

        .event-name,
        .status {
          font-size: 0.625rem;
          letter-spacing: 0.07em;
        }
      }

      @media (prefers-contrast: more) {
        :root {
          --text-sub: rgb(255 255 255 / 90%);
          --text-muted: rgb(255 255 255 / 72%);
          --rule: rgb(169 233 239 / 50%);
        }

        body::before {
          opacity: 0.5;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
  </head>

  <body>
    <main aria-labelledby="maintenance-title">
      <header class="masthead">
        <p class="event-name">
          第45回 技大祭 / NUTFES
        </p>

        <p class="status" aria-label="HTTPステータス 503">
          STATUS 503
        </p>
      </header>

      <section class="notice">
        <p class="kicker">
          SITE UPDATE
        </p>

        <h1 id="maintenance-title">
          <span class="title-line">ただいま</span>
          <span class="title-line title-main">メンテナンス中です</span>
        </h1>

        <p class="message">
          技大祭公式サイトは現在、メンテナンス作業中です。<br class="desktop-break" />
          一時的にご利用いただけません。
        </p>

        <section
          class="date"
          aria-labelledby="event-date-label"
        >
          <p
            id="event-date-label"
            class="date-label"
          >
            開催日 / EVENT DATE
          </p>

          <p class="date-value">
            <time datetime="2026-09-19">
              <span class="date-number">09.19</span>
              <span class="date-day">SAT</span>
            </time>

          <span
            class="date-separator"
            aria-hidden="true"
          ></span>

            <time datetime="2026-09-20">
              <span class="date-number">09.20</span>
              <span class="date-day">SUN</span>
            </time>
          </p>
        </section>

        <p class="closing">
          ご不便をおかけします。
          しばらく時間をおいてから、
          <span class="closing-action">再度アクセスしてください。</span>
        </p>
      </section>

      <footer class="footer">
        <p class="theme-label">
          2026 THEME
        </p>

        <p class="theme">
          Bluem Up Date
        </p>
      </footer>
    </main>
  </body>
</html>`;

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Language": "ja",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
  "Referrer-Policy": "no-referrer",
  "Retry-After": "60",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "X-NUTFes-Maintenance": "1",
};

export default {
  fetch(request) {
    if (request.method === "HEAD") {
      return new Response(null, {
        status: 503,
        headers: responseHeaders,
      });
    }

    if (request.method === "GET") {
      return new Response(maintenancePage, {
        status: 503,
        headers: {
          ...responseHeaders,
          "Content-Type": "text/html; charset=UTF-8",
        },
      });
    }

    return new Response(null, {
      status: 503,
      headers: responseHeaders,
    });
  },
};
