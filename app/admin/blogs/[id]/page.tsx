"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { ArrowLeft, Save, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
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

const BLOG_CATEGORIES = [
  "Travel Tips",
  "Destinations",
  "Adventures",
  "Culture",
  "Food & Cuisine",
  "Photography",
  "Budget Travel",
  "Luxury Travel",
  "Solo Travel",
  "Family Travel",
];

interface BlogFormData {
  title: string;
  slug: string;
  heroImage: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}

export default function BlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    heroImage: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    tags: [],
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`);
        if (response.ok) {
          const { blog } = await response.json();
          setFormData({
            title: blog.title || "",
            slug: blog.slug || "",
            heroImage: blog.heroImage || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            author: blog.author || "",
            category: blog.category || "",
            tags: blog.tags || [],
            isPublished: blog.isPublished || false,
            metaTitle: blog.metaTitle || "",
            metaDescription: blog.metaDescription || "",
          });
          setTagsInput((blog.tags || []).join(", "));
        } else {
          toast.error("Failed to fetch blog");
          router.push("/admin/blogs");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to fetch blog");
        router.push("/admin/blogs");
      } finally {
        setIsFetching(false);
      }
    }

    fetchBlog();
  }, [id, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug:
        !formData.slug || formData.slug === generateSlug(prev.title)
          ? generateSlug(value)
          : prev.slug,
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Blog updated successfully!");
        router.push("/admin/blogs");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update blog");
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
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Blog deleted successfully!");
        router.push("/admin/blogs");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete blog");
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/blogs">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Blog Post</h1>
              <p className="text-muted-foreground">
                Update your travel blog article
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formData.isPublished && formData.slug && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/blogs/${formData.slug}`} target="_blank">
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
                  <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this blog post? This action
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="blog-post-url"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /blogs/{formData.slug}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    id="excerpt"
                    placeholder="Brief description of the blog post"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Hero Image */}
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

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <TiptapEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  placeholder="Write your blog content..."
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Publish Settings</h3>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublished" className="text-sm">
                    Published
                  </Label>
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isPublished: checked }))
                    }
                  />
                </div>

                {formData.isPublished && (
                  <Badge className="w-full justify-center">
                    Live on Website
                  </Badge>
                )}
              </div>

              {/* Categorization */}
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Categorization</h3>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="travel, adventure, tips"
                    value={tagsInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SEO */}
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">SEO Settings</h3>

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
                  <Input
                    id="metaDescription"
                    placeholder="SEO description for search engines"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metaDescription: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Actions */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    Update Blog
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
