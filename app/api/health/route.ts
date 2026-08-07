import { NextResponse } from "next/server";

import { getPublicEnvironment } from "@/src/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  const environment = getPublicEnvironment();
  return NextResponse.json(
    {
      status: "ok",
      version: environment.APP_VERSION,
      environment: environment.NODE_ENV,
    },
    { status: 200 },
  );
}
