import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { publicTestimonialSubmissionSchema } from "@/lib/validations/testimonials-public";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = publicTestimonialSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const d = parsed.data;

  try {
    await prisma.testimonial.create({
      data: {
        clientName: d.clientName,
        role: "Verified client",
        company: d.company || "",
        review: d.review,
        rating: d.rating,
        serviceType: d.serviceType,
        imageUrl: d.imageUrl,
        approved: false,
        featured: false,
        source: "PUBLIC_SUBMISSION",
      },
    });
  } catch (e) {
    console.error("[POST /api/testimonials]", e);
    return NextResponse.json({ ok: false, error: "Could not save your review. Please try again later." }, { status: 500 });
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
