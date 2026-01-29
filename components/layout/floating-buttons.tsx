"use client";

import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/constants";
import { generateWhatsAppLink, generateMailtoLink } from "@/lib/utils";

export function FloatingButtons() {
  const whatsappLink = generateWhatsAppLink(
    CONTACT.whatsappNumber,
    "Hi! I'm interested in your travel packages.",
  );
  const mailtoLink = generateMailtoLink(
    CONTACT.primaryEmail,
    "Travel Enquiry",
    "Hi! I'm interested in your travel packages.",
  );

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center size-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="size-6" />
        </Link>
      </motion.div>

      {/* Email Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          href={mailtoLink}
          className="flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200"
          aria-label="Send Email"
        >
          <Mail className="size-6" />
        </Link>
      </motion.div>
    </div>
  );
}
