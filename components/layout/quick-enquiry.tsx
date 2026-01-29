"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Moon,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

export function QuickEnquiry() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    nights: "",
    adults: "2",
    children: "0",
    message: "",
  });

  // Fetch destinations
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch("/api/destinations");
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      }
    }
    fetchDestinations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "QUICK_ENQUIRY",
        }),
      });

      if (response.ok) {
        toast.success(
          "Enquiry submitted successfully! We'll contact you soon.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          destination: "",
          nights: "",
          adults: "2",
          children: "0",
          message: "",
        });
        setIsOpen(false);
      } else {
        toast.error("Failed to submit enquiry. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground px-2 py-4 rounded-r-lg shadow-lg hover:bg-primary/90 transition-colors writing-mode-vertical"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        aria-label="Quick Enquiry"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="size-4" />
          Quick Enquiry
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-full max-w-md bg-background z-[60] shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-primary/5">
                  <div>
                    <h2 className="text-xl font-bold">Quick Enquiry</h2>
                    <p className="text-sm text-muted-foreground">
                      Plan your dream vacation
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 overflow-y-auto"
                >
                  <div className="p-6 space-y-5">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Personal Details
                      </h3>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="quick-name"
                          className="text-sm flex items-center gap-2"
                        >
                          <User className="size-4 text-primary" />
                          Full Name *
                        </Label>
                        <Input
                          id="quick-name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="h-11"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="quick-email"
                            className="text-sm flex items-center gap-2"
                          >
                            <Mail className="size-4 text-primary" />
                            Email *
                          </Label>
                          <Input
                            id="quick-email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="h-11"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="quick-phone"
                            className="text-sm flex items-center gap-2"
                          >
                            <Phone className="size-4 text-primary" />
                            Phone *
                          </Label>
                          <Input
                            id="quick-phone"
                            type="tel"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="h-11"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trip Details Section */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Trip Details
                      </h3>

                      <div className="space-y-1.5">
                        <Label className="text-sm flex items-center gap-2">
                          <MapPin className="size-4 text-primary" />
                          Destination
                        </Label>
                        <Select
                          value={formData.destination}
                          onValueChange={(value) =>
                            setFormData({ ...formData, destination: value })
                          }
                        >
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Where to?" />
                          </SelectTrigger>
                          <SelectContent className="z-[70]">
                            {destinations.map((dest) => (
                              <SelectItem key={dest.id} value={dest.slug}>
                                {dest.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm flex items-center gap-2">
                          <Moon className="size-4 text-primary" />
                          Nights
                        </Label>
                        <Select
                          value={formData.nights}
                          onValueChange={(value) =>
                            setFormData({ ...formData, nights: value })
                          }
                        >
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent className="z-[70]">
                            {[...Array(15)].map((_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1} {i === 0 ? "Night" : "Nights"}
                              </SelectItem>
                            ))}
                            <SelectItem value="15+">15+ Nights</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm flex items-center gap-2">
                            <Users className="size-4 text-primary" />
                            Adults
                          </Label>
                          <Select
                            value={formData.adults}
                            onValueChange={(value) =>
                              setFormData({ ...formData, adults: value })
                            }
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[70]">
                              {[...Array(10)].map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  {i + 1} {i === 0 ? "Adult" : "Adults"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm flex items-center gap-2">
                            <Users className="size-4 text-primary" />
                            Children
                          </Label>
                          <Select
                            value={formData.children}
                            onValueChange={(value) =>
                              setFormData({ ...formData, children: value })
                            }
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[70]">
                              {[...Array(6)].map((_, i) => (
                                <SelectItem key={i} value={String(i)}>
                                  {i} {i === 1 ? "Child" : "Children"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Message Section */}
                    <div className="space-y-1.5 pt-2">
                      <Label
                        htmlFor="quick-message"
                        className="text-sm flex items-center gap-2"
                      >
                        <MessageSquare className="size-4 text-primary" />
                        Additional Requirements
                      </Label>
                      <Textarea
                        id="quick-message"
                        placeholder="Special requests, preferences, or any specific requirements..."
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="sticky bottom-0 p-6 bg-background border-t">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-5" />
                          Submit Enquiry
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      We&apos;ll get back to you within 24 hours
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
