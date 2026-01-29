import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      source,
      packageId,
      destination,
      message,
      travelDate,
      travelers,
      subject,
      nights,
      adults,
      children,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 },
      );
    }

    // Calculate total travelers from adults + children if provided
    const totalTravelers = travelers
      ? parseInt(travelers, 10)
      : adults || children
        ? parseInt(adults || "0", 10) + parseInt(children || "0", 10)
        : null;

    // Build additional info from form fields
    const additionalInfo = [];
    if (nights) additionalInfo.push(`Nights: ${nights}`);
    if (adults) additionalInfo.push(`Adults: ${adults}`);
    if (children) additionalInfo.push(`Children: ${children}`);

    const fullMessage = [
      additionalInfo.length > 0 ? `[${additionalInfo.join(", ")}]` : null,
      message || subject,
    ]
      .filter(Boolean)
      .join("\n");

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        source: source || "GENERAL",
        packageId: packageId || null,
        destination: destination || null,
        message: fullMessage || null,
        travelDate: travelDate ? new Date(travelDate) : null,
        travelers: totalTravelers,
      },
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        package: { select: { title: true, slug: true } },
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 },
    );
  }
}
