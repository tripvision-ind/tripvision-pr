"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";

export function TopInfoBar() {
  const [contactInfo, setContactInfo] = useState({
    primaryPhone: "",
    primaryEmail: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Fetch contact settings
        const contactResponse = await fetch("/api/admin/settings?key=contact");
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          if (contactData.value) {
            setContactInfo({
              primaryPhone: contactData.value.primaryPhone || "",
              primaryEmail: contactData.value.primaryEmail || "",
            });
          }
        }

        // Fetch social settings
        const socialResponse = await fetch("/api/admin/settings?key=social");
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          if (socialData.value) {
            setSocialLinks(socialData.value);
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="bg-primary text-primary-foreground text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-2">
          {/* Contact Info */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {contactInfo.primaryPhone && (
              <Link
                href={`tel:${contactInfo.primaryPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Phone className="size-3.5" />
                <span>{contactInfo.primaryPhone}</span>
              </Link>
            )}
            {contactInfo.primaryEmail && (
              <Link
                href={`mailto:${contactInfo.primaryEmail}`}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Mail className="size-3.5" />
                <span>{contactInfo.primaryEmail}</span>
              </Link>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.facebook && (
              <Link
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
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
                className="hover:opacity-80 transition-opacity"
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
                className="hover:opacity-80 transition-opacity"
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
                className="hover:opacity-80 transition-opacity"
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
                className="hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
