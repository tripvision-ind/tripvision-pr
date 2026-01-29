import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, answer, category, order, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 },
      );
    }

    // Get max order if not provided
    let faqOrder = order;
    if (faqOrder === undefined) {
      const maxOrder = await prisma.fAQ.aggregate({
        _max: { order: true },
      });
      faqOrder = (maxOrder._max.order || 0) + 1;
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        order: faqOrder,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 },
    );
  }
}
