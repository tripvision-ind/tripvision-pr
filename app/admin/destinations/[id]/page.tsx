"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ArrowLeft, Loader2, Save, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface DestinationFormData {
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  shortDescription: string;
  country: string;
  region: string;
  isPopular: boolean;
  isDomestic: boolean;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
}

export default function DestinationEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<DestinationFormData>({
    name: "",
    slug: "",
    description: "",
    heroImage: "",
    shortDescription: "",
    country: "",
    region: "",
    isPopular: false,
    isDomestic: true,
    isFeatured: false,
    isActive: true,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    async function fetchDestination() {
      try {
        const response = await fetch(`/api/admin/destinations/${id}`);
        if (response.ok) {
          const { destination } = await response.json();
          setFormData({
            name: destination.name || "",
            slug: destination.slug || "",
            description: destination.description || "",
            heroImage: destination.heroImage || "",
            shortDescription: destination.shortDescription || "",
            country: destination.country || "",
            region: destination.region || "",
            isPopular: destination.isPopular || false,
            isDomestic: destination.isDomestic ?? true,
            isFeatured: destination.isFeatured || false,
            isActive: destination.isActive ?? true,
            metaTitle: destination.metaTitle || "",
            metaDescription: destination.metaDescription || "",
          });
        } else {
          toast.error("Failed to fetch destination");
          router.push("/admin/destinations");
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
        toast.error("Failed to fetch destination");
        router.push("/admin/destinations");
      } finally {
        setIsFetching(false);
      }
    }

    fetchDestination();
  }, [id, router]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        !formData.slug || formData.slug === slugify(prev.name)
          ? slugify(name)
          : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Destination updated successfully!");
        router.push("/admin/destinations");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update destination");
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
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Destination deleted successfully!");
        router.push("/admin/destinations");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete destination");
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
              <Link href="/admin/destinations">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Destination</h1>
              <p className="text-muted-foreground">
                Update destination information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formData.slug && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/destinations/${formData.slug}`} target="_blank">
                  <Eye className="size-4 mr-2" />
                  Preview
                </Link>
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Destination</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this destination? This
                    action cannot be undone. All associated packages will be
                    affected.
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
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Destination Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Kashmir"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        placeholder="kashmir"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        URL: /destinations/{formData.slug}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        placeholder="North India"
                        value={formData.region}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            region: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Input
                      id="shortDescription"
                      placeholder="Brief tagline for the destination"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the destination..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Image</Label>
                    <ImageUpload
                      value={formData.heroImage}
                      onChange={(url) =>
                        setFormData((prev) => ({ ...prev, heroImage: url }))
                      }
                      onRemove={() =>
                        setFormData((prev) => ({ ...prev, heroImage: "" }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder="SEO title for search engines"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaTitle: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="SEO description for search engines"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPopular">Popular Destination</Label>
                    <Switch
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isPopular: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isDomestic">Domestic</Label>
                    <Switch
                      id="isDomestic"
                      checked={formData.isDomestic}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isDomestic: checked,
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
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
                        Update Destination
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
