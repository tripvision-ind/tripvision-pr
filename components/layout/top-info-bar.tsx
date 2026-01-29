"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";

export function TopInfoBar() {
  return (
    <div className="bg-primary text-primary-foreground text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-2">
          {/* Contact Info */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href={`tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Phone className="size-3.5" />
              <span>{CONTACT.primaryPhone}</span>
            </Link>
            <Link
              href={`mailto:${CONTACT.primaryEmail}`}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Mail className="size-3.5" />
              <span>{CONTACT.primaryEmail}</span>
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <Link
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook className="size-4" />
            </Link>
            <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </Link>
            <Link
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Twitter"
            >
              <Twitter className="size-4" />
            </Link>
            <Link
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="YouTube"
            >
              <Youtube className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
