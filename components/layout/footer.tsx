"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import { BRANCH_OFFICES } from "@/lib/constants";

interface Destination {
  id: string;
  name: string;
  slug: string;
  type: string;
}

// Static year to avoid hydration mismatch
const CURRENT_YEAR = 2026;

export function Footer() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  });
  const [brandInfo, setBrandInfo] = useState({
    name: "TripVision",
    tagline: "",
    description: "",
    experience: "30+",
  });
  const [contactInfo, setContactInfo] = useState({
    primaryPhone: "",
    secondaryPhone: "",
    primaryEmail: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch destinations
        const destResponse = await fetch("/api/destinations");
        if (destResponse.ok) {
          const destData = await destResponse.json();
          setDestinations(destData);
        }

        // Fetch social links from settings
        const socialResponse = await fetch("/api/admin/settings?key=social");
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          if (socialData.value) {
            setSocialLinks(socialData.value);
          }
        }

        // Fetch brand settings
        const brandResponse = await fetch("/api/admin/settings?key=brand");
        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          if (brandData.value) {
            setBrandInfo((prev) => ({ ...prev, ...brandData.value }));
          }
        }

        // Fetch contact settings
        const contactResponse = await fetch("/api/admin/settings?key=contact");
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          if (contactData.value) {
            setContactInfo(contactData.value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  // Group destinations by type
  const indiaDestinations = destinations
    .filter((d) => d.type === "DOMESTIC")
    .slice(0, 6);
  const internationalDestinations = destinations
    .filter((d) => d.type === "INTERNATIONAL")
    .slice(0, 6);

  return (
    <footer className="bg-brand-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/vision.png"
                alt={brandInfo.name}
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              With over {brandInfo.experience} years of experience, we craft
              unforgettable travel experiences tailored to your desires. Your
              journey, our passion.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.facebook && (
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4" />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="size-4" />
                </Link>
              )}
              {socialLinks.youtube && (
                <Link
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="size-4" />
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {/* India Holidays - Dynamic */}
          <div>
            <h3 className="font-semibold text-lg mb-4">India Holidays</h3>
            <ul className="space-y-2">
              {indiaDestinations.length > 0 ? (
                indiaDestinations.map((dest) => (
                  <li key={dest.id}>
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      {dest.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/destinations?type=domestic"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Kashmir
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/destinations?type=domestic"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Kerala
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/destinations?type=domestic"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Goa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/destinations?type=domestic"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Rajasthan
                    </Link>
                  </li>
                </>
              )}
              <li className="pt-2">
                <Link
                  href="/destinations?type=domestic"
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  View All India Destinations →
                </Link>
              </li>
            </ul>
          </div>

          {/* International Holidays - Dynamic */}
          <div>
            <h3 className="font-semibold text-lg mb-4">International</h3>
            <ul className="space-y-2">
              {internationalDestinations.length > 0 ? (
                internationalDestinations.map((dest) => (
                  <li key={dest.id}>
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      {dest.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/destinations?type=international"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Dubai
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/destinations?type=international"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Thailand
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/destinations?type=international"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Maldives
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/destinations?type=international"
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      Bali
                    </Link>
                  </li>
                </>
              )}
              <li className="pt-2">
                <Link
                  href="/destinations?type=international"
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  View All International →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 mt-1 text-primary shrink-0" />
                <span className="text-gray-300 text-sm">
                  {BRANCH_OFFICES[0].address}, {BRANCH_OFFICES[0].city} -{" "}
                  {BRANCH_OFFICES[0].pincode}
                </span>
              </li>
              <li>
                {contactInfo.primaryPhone && (
                  <Link
                    href={`tel:${contactInfo.primaryPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    <Phone className="size-4 text-primary shrink-0" />
                    {contactInfo.primaryPhone}
                  </Link>
                )}
              </li>
              <li>
                {contactInfo.secondaryPhone && (
                  <Link
                    href={`tel:${contactInfo.secondaryPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    <Phone className="size-4 text-primary shrink-0" />
                    {contactInfo.secondaryPhone}
                  </Link>
                )}
              </li>
              <li>
                {contactInfo.primaryEmail && (
                  <Link
                    href={`mailto:${contactInfo.primaryEmail}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    <Mail className="size-4 text-primary shrink-0" />
                    {contactInfo.primaryEmail}
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {CURRENT_YEAR} {brandInfo.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
