const maintenancePage = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>メンテナンス中 | 第45回 技大祭</title>

    <style>
      :root {
        color-scheme: dark;
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

      body {
        display: grid;
        min-height: 100svh;
        margin: 0;
        padding: 24px;
        place-items: center;
        color: #ffffff;
        background: #18247a;
      }

      main {
        width: min(100%, 640px);
        text-align: center;
      }

      p {
        margin: 0;
      }

      .event-name {
        margin-bottom: 16px;
        color: #a9e9ef;
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: 0.12em;
      }

      h1 {
        margin: 0 0 24px;
        font-size: clamp(1.75rem, 5vw, 2.5rem);
        line-height: 1.4;
        text-wrap: balance;
      }

      .message,
      .closing {
        font-size: 1rem;
        line-height: 1.9;
      }

      .date {
        margin: 32px 0;
        padding: 24px 0;
        border-top: 1px solid rgb(255 255 255 / 20%);
        border-bottom: 1px solid rgb(255 255 255 / 20%);
      }

      .date-label {
        margin-bottom: 8px;
        color: #a9e9ef;
        font-size: 0.8125rem;
        font-weight: 700;
      }

      .date-value {
        font-size: clamp(1.125rem, 4vw, 1.375rem);
        font-weight: 700;
        line-height: 1.7;
      }

      .theme {
        margin-top: 40px;
        color: rgb(255 255 255 / 60%);
        font-size: 0.75rem;
      }

      @media (max-width: 480px) {
        body {
          padding: 24px 20px;
        }

        .message br,
        .closing br {
          display: none;
        }
      }
    </style>
  </head>

  <body>
    <main aria-labelledby="maintenance-title">
      <p class="event-name">第45回 技大祭</p>

      <h1 id="maintenance-title">
        ただいまメンテナンス中です
      </h1>

      <p class="message">
        技大祭公式サイトは現在、<br />
        メンテナンスのため一時的にご利用いただけません。
      </p>

      <section class="date" aria-labelledby="event-date-label">
        <p id="event-date-label" class="date-label">開催日</p>
        <p class="date-value">
          <time datetime="2026-09-19">9月19日（土）</time><br />
          <time datetime="2026-09-20">9月20日（日）</time>
        </p>
      </section>

      <p class="closing">
        ご不便をおかけしますが、<br />
        しばらく時間をおいてから再度アクセスしてください。
      </p>

      <p class="theme">
        45th NUTFES — Bluem Up Date
      </p>
    </main>
  </body>
</html>
`;

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Language": "ja",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
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
