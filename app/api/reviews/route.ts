import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(50, "Review content must be at least 50 characters"),
  location: z.string().optional(),
  tripType: z.string().optional(),
});

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Create the review with default approval status as false
    const review = await prisma.review.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        location: validatedData.location,
        tripType: validatedData.tripType,
        isApproved: false, // All reviews need approval
        isFeatured: false,
      },
    });

    return NextResponse.json(
      {
        message:
          "Review submitted successfully! It will be published after approval.",
        review: {
          id: review.id,
          name: review.name,
          rating: review.rating,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating review:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
