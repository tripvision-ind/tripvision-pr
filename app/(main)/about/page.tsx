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
      <section className="bg-brand-dark py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
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
              <div className="prose prose-gray max-w-none">
                {ABOUT.overview.split("\n\n").map((para, idx) => (
                  <p
                    key={idx}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
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
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We specialize in creating memorable travel experiences across
              various tour categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TOUR_TYPES.map((tour, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 mb-4">
                  <Heart className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">{tour}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With over 30 years of expertise, we deliver excellence in every
              journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Trusted & Reliable",
                desc: "30+ years of industry experience with thousands of satisfied travelers.",
              },
              {
                icon: Users,
                title: "Expert Team",
                desc: "Dedicated travel experts who understand your needs and preferences.",
              },
              {
                icon: Heart,
                title: "Personalized Service",
                desc: "Customized itineraries tailored to your unique travel desires.",
              },
              {
                icon: Award,
                title: "Best Value",
                desc: "Competitive pricing without compromising on quality experiences.",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                desc: "Round-the-clock assistance throughout your journey.",
              },
              {
                icon: MapPin,
                title: "Local Expertise",
                desc: "Deep knowledge of destinations with exclusive local connections.",
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
