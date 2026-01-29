import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore our diverse range of travel destinations. From serene beaches to majestic mountains, find your perfect getaway.",
};

async function getDestinations() {
  const [domestic, international] = await Promise.all([
    prisma.destination.findMany({
      where: { isActive: true, isDomestic: true },
      include: { _count: { select: { packages: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.destination.findMany({
      where: { isActive: true, isDomestic: false },
      include: { _count: { select: { packages: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { domestic, international };
}

export default async function DestinationsPage() {
  const { domestic, international } = await getDestinations();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Explore Destinations
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            From the snow-capped Himalayas to tropical beaches, discover
            breathtaking destinations for your next adventure.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="domestic" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
              <TabsTrigger value="domestic">
                India ({domestic.length})
              </TabsTrigger>
              <TabsTrigger value="international">
                International ({international.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="domestic">
              <DestinationGrid destinations={domestic} />
            </TabsContent>

            <TabsContent value="international">
              <DestinationGrid destinations={international} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function DestinationGrid({
  destinations,
}: {
  destinations: {
    id: string;
    name: string;
    slug: string;
    heroImage: string;
    country: string;
    shortDescription: string | null;
    _count: { packages: number };
  }[];
}) {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
        <p className="text-muted-foreground">
          Check back soon for new destinations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map((dest) => (
        <Link
          key={dest.id}
          href={`/destinations/${dest.slug}`}
          className="group block relative rounded-2xl overflow-hidden aspect-[4/5]"
        >
          <Image
            src={dest.heroImage || "/placeholder-destination.jpg"}
            alt={dest.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-1 text-primary text-sm mb-2">
              <MapPin className="size-3.5" />
              {dest.country}
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {dest.name}
            </h3>
            {dest._count.packages > 0 && (
              <p className="text-gray-300 text-sm">
                {dest._count.packages} packages available
              </p>
            )}
          </div>

          <div className="absolute top-4 right-4 size-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="size-5 text-white" />
          </div>
        </Link>
      ))}
    </div>
  );
}
