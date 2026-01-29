import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET - Get single enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiry" },
      { status: 500 },
    );
  }
}

// PATCH - Update enquiry status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 },
    );
  }
}

// DELETE - Delete enquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.enquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 },
    );
  }
}
