import configPromise from "@payload-config";
import { getPayload } from "payload";

type PostgresPoolLike = {
  query: (sql: string) => Promise<unknown>;
};

type PostgresAdapterLike = {
  pool?: PostgresPoolLike;
};

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const strict = searchParams.get("strict") === "1";
  const now = new Date().toISOString();
  const healthKey = request.headers.get("x-health-key");
  const strictHealthKey = process.env.HEALTH_CHECK_KEY;

  if (strict && (!strictHealthKey || healthKey !== strictHealthKey)) {
    return Response.json(
      {
        status: "forbidden",
        service: "45th-homepage",
        mode: "strict",
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
        time: now,
      },
      { status: 200 },
    );
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    });
    const adapter = payload.db as PostgresAdapterLike;

    if (!adapter.pool || typeof adapter.pool.query !== "function") {
      throw new Error("db_pool_unavailable");
    }

    await adapter.pool.query("SELECT 1");

    return Response.json(
      {
        status: "ok",
        service: "45th-homepage",
        mode: "strict",
        db: "up",
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
        time: now,
      },
      { status: 503 },
    );
  }
}
