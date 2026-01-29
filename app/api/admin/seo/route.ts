import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const seoSettings = await prisma.siteSeo.findMany({
      orderBy: { route: "asc" },
    });

    return NextResponse.json({ seoSettings });
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEO settings" },
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
    const {
      route,
      pageTitle,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      robots,
      structuredData,
    } = body;

    if (!route || !pageTitle) {
      return NextResponse.json(
        { error: "Route and page title are required" },
        { status: 400 },
      );
    }

    // Upsert - create or update
    const seo = await prisma.siteSeo.upsert({
      where: { route },
      update: {
        pageTitle,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
        canonicalUrl,
        robots,
        structuredData,
      },
      create: {
        route,
        pageTitle,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
        canonicalUrl,
        robots,
        structuredData,
      },
    });

    return NextResponse.json({ success: true, seo }, { status: 201 });
  } catch (error) {
    console.error("Error saving SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to save SEO settings" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.siteSeo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to delete SEO settings" },
      { status: 500 },
    );
  }
}
