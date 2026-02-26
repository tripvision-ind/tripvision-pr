import { Metadata } from "next";
import Image from "next/image";
import { ABOUT, BRAND, TOUR_TYPES, BRANCH_OFFICES } from "@/lib/constants";
import { Award, Users, MapPin, Clock, Heart, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT.short,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
          alt="About Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
            Since 1994
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            About {BRAND.name}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {ABOUT.short}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-gray max-w-none space-y-4">
                {ABOUT.overview.split("\n\n").map((para, idx) => (
                  <p
                    key={idx}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
              <p className="mt-6 text-primary font-medium">{ABOUT.cta}</p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/about-team.jpg"
                alt="TripVision Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "30+", label: "Years Experience", icon: Clock },
              { value: "50K+", label: "Happy Travelers", icon: Users },
              { value: "500+", label: "Tour Packages", icon: MapPin },
              { value: "100+", label: "Destinations", icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="size-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Popular Destinations &amp; Experiences
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From mountain bliss to beach retreats — explore India and beyond
              with Tripvision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: "Mountain Bliss",
                items: [
                  "Darjeeling & Gangtok",
                  "Leh Ladakh Off-Road",
                  "Himachal Hill Stations",
                ],
                icon: "🏔️",
              },
              {
                category: "Cultural & Heritage",
                items: [
                  "Spiritual Varanasi Ghats",
                  "Golden Temple, Amritsar",
                  "South India Temple Trails",
                ],
                icon: "🏛️",
              },
              {
                category: "Beach & Island Retreats",
                items: [
                  "Goa Beaches & Water Sports",
                  "Kerala Houseboat Cruises",
                  "Andaman & Nicobar Islands",
                ],
                icon: "🏖️",
              },
              {
                category: "Adventure & Wildlife",
                items: [
                  "Himalayan Treks & Jeep Safaris",
                  "Water Sports Packages",
                  "Wildlife Safaris & Eco Tours",
                ],
                icon: "🦁",
              },
            ].map((dest, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{dest.icon}</div>
                <h3 className="font-semibold text-lg mb-3">{dest.category}</h3>
                <ul className="space-y-1.5">
                  {dest.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Our Tour Types</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TOUR_TYPES.map((tour, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-xl p-5 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 mb-3">
                    <Heart className="size-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{tour}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">What&apos;s Included</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every Tripvision package is designed to give you a complete,
              worry-free travel experience.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Transportation (Cars, Buses) Included",
              "Hotel and Resort Stays",
              "Sightseeing and Local Guides",
              "Meals (as per itinerary)",
              "Travel Insurance Options",
              "24×7 Customer Support",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-card border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <span className="text-primary font-bold text-lg">✔</span>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Tripvision?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We stand for integrity, joy, and worry-free travel planning — from
              your first inquiry to your return journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Professional & Personalised Service",
                desc: "Tailored itineraries crafted to match your unique preferences, travel style, and budget requirements.",
              },
              {
                icon: Award,
                title: "India's Leading Travel Agency",
                desc: "A trusted name in Indian travel with decades of expertise booking dream vacations across the country.",
              },
              {
                icon: Heart,
                title: "Best Holiday Deals, Always",
                desc: "Competitive pricing, exclusive deals, and the best value packages — no hidden costs, ever.",
              },
              {
                icon: Shield,
                title: "Secure Transactions",
                desc: "Book with complete confidence. Safe, encrypted, and hassle-free payment processing at Tripvision.in.",
              },
              {
                icon: Clock,
                title: "24/7 Customer Support",
                desc: "Round-the-clock assistance before, during, and after your trip for complete peace of mind.",
              },
              {
                icon: Users,
                title: "Expert Local Guides",
                desc: "Knowledgeable guides who bring destinations to life with authentic local stories and experiences.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 mb-4">
                  <item.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Offices</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit us at any of our branch offices across India and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANCH_OFFICES.map((office, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="size-5 text-primary" />
                  <h3 className="font-semibold">{office.city}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {office.address}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {office.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
