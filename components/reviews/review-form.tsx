"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, User, Mail, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const tripTypes = [
  "Family Trip",
  "Honeymoon",
  "Solo Travel",
  "Friends Getaway",
  "Business Trip",
  "Adventure",
  "Pilgrimage",
  "Photography Tour",
  "Wildlife Safari",
  "Cultural Tour",
];

interface ReviewFormData {
  name: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  location: string;
  tripType: string;
}

export function ReviewForm() {
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    email: "",
    rating: 5,
    title: "",
    content: "",
    location: "",
    tripType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      toast.success(
        "🎉 Thank you for your review! It will be published after our quality review process.",
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        rating: 5,
        title: "",
        content: "",
        location: "",
        tripType: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Heart className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Share Your Travel Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Help fellow travelers by sharing your journey and experience with
              us. Your authentic review matters and helps us serve you better
              while assisting other travelers in making informed decisions.
            </p>
          </div>

          {/* Review Form */}
          <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold">
                Write Your Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Your Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, State"
                      className="h-12"
                    />
                  </div>

                  {/* Trip Type */}
                  <div className="space-y-2">
                    <Label htmlFor="tripType">Trip Type</Label>
                    <Select
                      value={formData.tripType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, tripType: value }))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tripTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.button
                        key={i}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRatingChange(i + 1)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            i < formData.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </motion.button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {formData.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Review Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Summarize your experience in a few words"
                    className="h-12"
                  />
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Your Experience</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Share your detailed experience, what you loved, highlights of your trip, accommodation quality, guide services, and any suggestions for improvement..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Minimum 50 characters required
                    </p>
                    <p
                      className={`text-xs ${
                        formData.content.length < 50
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {formData.content.length}/50
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isLoading || formData.content.length < 50}
                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Submit Review
                      </div>
                    )}
                  </Button>
                </motion.div>

                <p className="text-xs text-center text-muted-foreground">
                  Your review will be published after our team reviews it for
                  quality and authenticity.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
