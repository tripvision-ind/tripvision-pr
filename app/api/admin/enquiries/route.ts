import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const source = searchParams.get("source");
    const status = searchParams.get("status");
    const destination = searchParams.get("destination");
    const packageId = searchParams.get("packageId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const dateRange = searchParams.get("dateRange");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (source && source !== "all") {
      where.source = source;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (destination && destination !== "all") {
      where.destination = { contains: destination, mode: "insensitive" };
    }

    if (packageId && packageId !== "all") {
      where.packageId = packageId;
    }

    // Date filtering
    if (dateFrom || dateTo || dateRange) {
      const dateWhere: any = {};

      if (dateRange) {
        const now = new Date();

        switch (dateRange) {
          case "this-month":
            dateWhere.gte = new Date(now.getFullYear(), now.getMonth(), 1);
            dateWhere.lt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
          case "next-month":
            dateWhere.gte = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            dateWhere.lt = new Date(now.getFullYear(), now.getMonth() + 2, 1);
            break;
          case "this-quarter":
            const thisQuarterStart = new Date(
              now.getFullYear(),
              Math.floor(now.getMonth() / 3) * 3,
              1,
            );
            const thisQuarterEnd = new Date(
              now.getFullYear(),
              Math.floor(now.getMonth() / 3) * 3 + 3,
              1,
            );
            dateWhere.gte = thisQuarterStart;
            dateWhere.lt = thisQuarterEnd;
            break;
          case "next-quarter":
            const nextQuarterStart = new Date(
              now.getFullYear(),
              Math.floor(now.getMonth() / 3) * 3 + 3,
              1,
            );
            const nextQuarterEnd = new Date(
              now.getFullYear(),
              Math.floor(now.getMonth() / 3) * 3 + 6,
              1,
            );
            dateWhere.gte = nextQuarterStart;
            dateWhere.lt = nextQuarterEnd;
            break;
          default:
            if (dateRange.match(/^\d{4}$/)) {
              const year = parseInt(dateRange);
              dateWhere.gte = new Date(year, 0, 1);
              dateWhere.lt = new Date(year + 1, 0, 1);
            }
        }
      } else {
        if (dateFrom) {
          dateWhere.gte = new Date(dateFrom);
        }
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          dateWhere.lte = toDate;
        }
      }

      if (Object.keys(dateWhere).length > 0) {
        where.createdAt = dateWhere;
      }
    }

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          package: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 },
    );
  }
}
