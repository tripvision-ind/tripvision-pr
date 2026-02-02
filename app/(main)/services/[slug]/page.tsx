import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  return prisma.service.findUnique({
    where: { slug, isActive: true },
  });
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.shortDescription || service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The service you're looking for doesn't exist.
          </p>
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const iconName = service.icon as keyof typeof LucideIcons;
  const IconComponent: LucideIcon =
    iconName && iconName in LucideIcons
      ? (LucideIcons[iconName] as LucideIcon)
      : LucideIcons.Briefcase;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        {service.image ? (
          <div className="relative h-[300px] lg:h-[400px]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="h-[300px] lg:h-[400px] bg-brand-dark" />
        )}

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-white hover:bg-white/20"
                >
                  <Link href="/services">
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  Service
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="inline-flex items-center justify-center size-12 sm:size-16 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <IconComponent className="size-6 sm:size-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 break-words">
                    {service.title}
                  </h1>
                  {service.shortDescription && (
                    <p className="text-base sm:text-lg text-gray-200 max-w-2xl break-words">
                      {service.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: service.description.replace(/\n/g, "<br />"),
                }}
              />
            </div>

            {/* CTA */}
            <div className="mt-12 pt-8 border-t">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Experience This Service?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Contact us today to learn more about this service and how we
                  can help you with your travel needs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Get in Touch
                      <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/packages">Browse Packages</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
