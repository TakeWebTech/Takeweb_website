import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json(
    { revalidated: false, message: "Invalid revalidation secret." },
    { status: 401 },
  );
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.STRAPI_REVALIDATE_SECRET;
  const providedSecret = request.headers.get("x-revalidate-secret");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return unauthorized();
  }

  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    message: "Cache cleared.",
    revalidatedAt: new Date().toISOString(),
  });
}
