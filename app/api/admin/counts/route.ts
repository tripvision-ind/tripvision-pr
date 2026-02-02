import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET - Fetch counts for sidebar badges
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      pendingEnquiries,
      pendingReviews,
      unreadNotifications,
      totalPackages,
      totalDestinations,
      totalBlogs,
      totalServices,
    ] = await Promise.all([
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.notification.count({ where: { isRead: false } }),
      prisma.package.count(),
      prisma.destination.count(),
      prisma.blog.count(),
      prisma.service.count(),
    ]);

    return NextResponse.json({
      enquiries: pendingEnquiries,
      reviews: pendingReviews,
      notifications: unreadNotifications,
      packages: totalPackages,
      destinations: totalDestinations,
      blogs: totalBlogs,
      services: totalServices,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 },
    );
  }
}
