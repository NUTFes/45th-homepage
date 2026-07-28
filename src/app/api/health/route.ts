import configPromise from "@payload-config";
import { getPayload } from "payload";

type PostgresPoolLike = {
  query: (sql: string) => Promise<unknown>;
};

type PostgresAdapterLike = {
  pool?: PostgresPoolLike;
};

const DATABASE_PROBE_TIMEOUT_MS = 3_000;

async function probeDatabase(): Promise<void> {
  const payload = await getPayload({
    config: configPromise,
  });
  const adapter = payload.db as PostgresAdapterLike;

  if (!adapter.pool || typeof adapter.pool.query !== "function") {
    throw new Error("db_pool_unavailable");
  }

  await adapter.pool.query("SELECT 1");
}

async function checkDatabase(): Promise<void> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      probeDatabase(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error("db_probe_timeout"));
        }, DATABASE_PROBE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const strict = searchParams.get("strict") === "1";
  const now = new Date().toISOString();
  const healthKey = request.headers.get("x-health-key");
  const strictHealthKey = process.env.HEALTH_CHECK_KEY;
  const revision = process.env.RELEASE_REVISION ?? "unknown";

  if (strict && (!strictHealthKey || healthKey !== strictHealthKey)) {
    return Response.json(
      {
        status: "forbidden",
        service: "45th-homepage",
        mode: "strict",
        revision,
        time: now,
      },
      { status: 403 },
    );
  }

  if (!strict) {
    return Response.json(
      {
        status: "ok",
        service: "45th-homepage",
        mode: "basic",
        revision,
        time: now,
      },
      { status: 200 },
    );
  }

  try {
    await checkDatabase();

    return Response.json(
      {
        status: "ok",
        service: "45th-homepage",
        mode: "strict",
        db: "up",
        revision,
        time: now,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Strict health check failed", error);

    return Response.json(
      {
        status: "degraded",
        service: "45th-homepage",
        mode: "strict",
        db: "down",
        revision,
        time: now,
      },
      { status: 503 },
    );
  }
}
