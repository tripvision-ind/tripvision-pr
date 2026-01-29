import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET - Fetch all settings or specific key
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await prisma.siteSetting.findUnique({
        where: { key },
      });

      if (!setting) {
        return NextResponse.json({ key, value: null });
      }

      return NextResponse.json({
        key: setting.key,
        value: setting.type === "JSON" ? JSON.parse(setting.value) : setting.value,
      });
    }

    // Fetch all settings
    const settings = await prisma.siteSetting.findMany();
    const formattedSettings: Record<string, unknown> = {};

    for (const setting of settings) {
      formattedSettings[setting.key] = setting.type === "JSON" ? JSON.parse(setting.value) : setting.value;
    }

    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Create or update settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    const isObject = typeof value === "object";
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value: isObject ? JSON.stringify(value) : String(value),
        type: isObject ? "JSON" : "TEXT",
      },
      create: {
        key,
        value: isObject ? JSON.stringify(value) : String(value),
        type: isObject ? "JSON" : "TEXT",
        category: key,
      },
    });

    return NextResponse.json({
      key: setting.key,
      value: setting.type === "JSON" ? JSON.parse(setting.value) : setting.value,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

// PUT - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Body should be an object with key-value pairs
    const updates = Object.entries(body).map(([key, value]) => {
      const isObject = typeof value === "object";
      return prisma.siteSetting.upsert({
        where: { key },
        update: {
          value: isObject ? JSON.stringify(value) : String(value),
          type: isObject ? "JSON" : "TEXT",
        },
        create: {
          key,
          value: isObject ? JSON.stringify(value) : String(value),
          type: isObject ? "JSON" : "TEXT",
          category: key,
        },
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
