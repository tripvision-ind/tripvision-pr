import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });
    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Build update data, only including fields that are provided
    const updateData: Record<string, unknown> = {};

    if ("name" in body) updateData.name = body.name;
    if ("email" in body) updateData.email = body.email;
    if ("location" in body) updateData.location = body.location;
    if ("rating" in body) updateData.rating = typeof body.rating === "string" ? parseInt(body.rating) : body.rating;
    if ("content" in body) updateData.content = body.content;
    if ("avatar" in body) updateData.avatar = body.avatar || "";
    if ("title" in body) updateData.title = body.title;
    if ("tripType" in body) updateData.tripType = body.tripType;
    if ("isApproved" in body) updateData.isApproved = body.isApproved;
    if ("isFeatured" in body) updateData.isFeatured = body.isFeatured;

    // Validate required fields only if they are being updated to empty values
    const finalName = "name" in updateData ? updateData.name : existingReview.name;
    const finalContent = "content" in updateData ? updateData.content : existingReview.content;
    const finalRating = "rating" in updateData ? updateData.rating as number : existingReview.rating;

    if (!finalName || !finalContent) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 },
      );
    }

    if (finalRating < 1 || finalRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });
    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
