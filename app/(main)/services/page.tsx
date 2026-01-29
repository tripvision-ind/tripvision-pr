import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our comprehensive range of travel services designed to make your journey memorable.",
};

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Comprehensive travel solutions tailored to create unforgettable
            experiences for every type of traveler.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">
                No services listed yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for our complete list of services.
              </p>
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const iconName = service.icon as keyof typeof LucideIcons;
                const IconComponent: LucideIcon =
                  iconName && iconName in LucideIcons
                    ? (LucideIcons[iconName] as LucideIcon)
                    : Briefcase;

                return (
                  <div
                    key={service.id}
                    className="bg-card border rounded-2xl p-6 hover:shadow-xl transition-all group"
                  >
                    <div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="size-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    {service.shortDescription && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {service.shortDescription}
                      </p>
                    )}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-primary font-medium text-sm hover:underline"
                    >
                      Learn More
                      <ArrowRight className="size-4 ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Contact us today to discuss your travel needs and let us help you
            plan the perfect trip.
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
      </section>
    </div>
  );
}
