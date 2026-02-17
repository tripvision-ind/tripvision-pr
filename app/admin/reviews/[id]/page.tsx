"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Save, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/image-upload";

interface ReviewFormData {
  name: string;
  location: string;
  rating: number;
  content: string;
  avatar: string;
  title: string;
  tripType: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export default function ReviewEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    location: "",
    rating: 5,
    content: "",
    avatar: "",
    title: "",
    tripType: "",
    isApproved: false,
    isFeatured: false,
  });

  useEffect(() => {
    async function fetchReview() {
      try {
        const response = await fetch(`/api/admin/reviews/${id}`);
        if (response.ok) {
          const { review } = await response.json();
          setFormData({
            name: review.name || "",
            location: review.location || "",
            rating: review.rating || 5,
            content: review.content || "",
            avatar: review.avatar || "",
            title: review.title || "",
            tripType: review.tripType || "",
            isApproved: review.isApproved || false,
            isFeatured: review.isFeatured || false,
          });
        } else {
          toast.error("Failed to fetch review");
          router.push("/admin/reviews");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        toast.error("Failed to fetch review");
        router.push("/admin/reviews");
      } finally {
        setIsFetching(false);
      }
    }

    fetchReview();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Review updated successfully!");
        router.push("/admin/reviews");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Review deleted successfully!");
        router.push("/admin/reviews");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/reviews">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Review</h1>
              <p className="text-muted-foreground">Update customer review</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Review</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Customer Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Mumbai, India"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Review Title</Label>
                      <Input
                        id="title"
                        placeholder="Amazing Experience"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tripType">Trip Type</Label>
                      <Input
                        id="tripType"
                        placeholder="Honeymoon, Family, Adventure"
                        value={formData.tripType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tripType: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating *</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, rating: star }))
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`size-8 transition-colors ${
                              star <= formData.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300 hover:text-gray-400"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-muted-foreground">
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Review Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Customer's review..."
                      rows={6}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Customer Photo</Label>
                    <ImageUpload
                      value={formData.avatar}
                      onChange={(url) =>
                        setFormData((prev) => ({ ...prev, avatar: url }))
                      }
                      onRemove={() =>
                        setFormData((prev) => ({ ...prev, avatar: "" }))
                      }
                      folder="reviews"
                      aspectRatio="square"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isApproved">Approved</Label>
                    <Switch
                      id="isApproved"
                      checked={formData.isApproved}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isApproved: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">Featured</Label>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: checked,
                        }))
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="size-4 mr-2" />
                        Update Review
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
