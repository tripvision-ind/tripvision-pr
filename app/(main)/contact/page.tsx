"use client";

import { useState } from "react";
import { Metadata } from "next";
import { CONTACT, BRANCH_OFFICES, BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { generateWhatsAppLink } from "@/lib/utils";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "CONTACT_PAGE",
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions? We&apos;re here to help. Reach out to us and
            let&apos;s start planning your dream vacation.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your travel plans..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              <div className="space-y-6">
                {/* Quick Contact */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Quick Contact</h3>
                  <div className="space-y-4">
                    <a
                      href={`tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{CONTACT.primaryPhone}</p>
                        <p className="text-sm text-muted-foreground">
                          {CONTACT.secondaryPhone}
                        </p>
                      </div>
                    </a>
                    <a
                      href={`mailto:${CONTACT.primaryEmail}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{CONTACT.primaryEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          {CONTACT.secondaryEmail}
                        </p>
                      </div>
                    </a>
                    <a
                      href={generateWhatsAppLink(CONTACT.whatsappNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <MessageCircle className="size-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">
                          Chat with us instantly
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monday - Friday
                      </span>
                      <span className="font-medium">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Main Office */}
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    Head Office
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {BRANCH_OFFICES[0].address}, {BRANCH_OFFICES[0].city} -{" "}
                    {BRANCH_OFFICES[0].pincode}, {BRANCH_OFFICES[0].state},{" "}
                    {BRANCH_OFFICES[0].country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Offices */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Our Branch Offices
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANCH_OFFICES.map((office, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="size-5 text-primary" />
                  <h3 className="font-semibold">{office.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {office.address}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {office.city}, {office.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
