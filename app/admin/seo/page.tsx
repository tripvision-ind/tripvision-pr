"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Save,
  Plus,
  Pencil,
  Trash2,
  Globe,
  Search,
  Share2,
  Twitter,
  Code,
} from "lucide-react";
import { toast } from "sonner";

interface SeoSetting {
  id: string;
  route: string;
  pageTitle: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: string;
}

const DEFAULT_ROUTES = [
  { route: "/", label: "Home" },
  { route: "/about", label: "About Us" },
  { route: "/contact", label: "Contact" },
  { route: "/packages", label: "Packages" },
  { route: "/destinations", label: "Destinations" },
  { route: "/blogs", label: "Blogs" },
  { route: "/services", label: "Services" },
  { route: "/faq", label: "FAQ" },
];

const ROBOT_OPTIONS = [
  { value: "index, follow", label: "Index & Follow (Default)" },
  { value: "noindex, follow", label: "No Index, Follow" },
  { value: "index, nofollow", label: "Index, No Follow" },
  { value: "noindex, nofollow", label: "No Index, No Follow" },
];

export default function SeoPage() {
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SeoSetting | null>(null);
  const [formData, setFormData] = useState<Partial<SeoSetting>>({
    route: "",
    pageTitle: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    canonicalUrl: "",
    robots: "index, follow",
    structuredData: "",
  });

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    try {
      const response = await fetch("/api/admin/seo");
      if (response.ok) {
        const data = await response.json();
        setSeoSettings(data.seoSettings || []);
      }
    } catch (error) {
      console.error("Failed to fetch SEO settings:", error);
      toast.error("Failed to load SEO settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("SEO settings saved successfully!");
        fetchSeoSettings();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save SEO settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: SeoSetting) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SEO setting?")) return;

    try {
      const response = await fetch(`/api/admin/seo?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("SEO setting deleted");
        fetchSeoSettings();
      } else {
        toast.error("Failed to delete SEO setting");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      route: "",
      pageTitle: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      canonicalUrl: "",
      robots: "index, follow",
      structuredData: "",
    });
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SEO Settings</h1>
            <p className="text-muted-foreground">
              Manage SEO for all pages and routes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="size-4" />
                Add SEO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit SEO Settings" : "Add SEO Settings"}
                </DialogTitle>
                <DialogDescription>
                  Configure SEO settings for a specific page or route
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic" className="gap-2">
                      <Globe className="size-4" />
                      Basic
                    </TabsTrigger>
                    <TabsTrigger value="meta" className="gap-2">
                      <Search className="size-4" />
                      Meta
                    </TabsTrigger>
                    <TabsTrigger value="social" className="gap-2">
                      <Share2 className="size-4" />
                      Social
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2">
                      <Code className="size-4" />
                      Advanced
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="route">Route / Page *</Label>
                        <Select
                          value={formData.route}
                          onValueChange={(value) =>
                            setFormData({ ...formData, route: value })
                          }
                          disabled={!!editingItem}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select or type a route" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_ROUTES.map((r) => (
                              <SelectItem key={r.route} value={r.route}>
                                {r.label} ({r.route})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Or enter custom route below
                        </p>
                        <Input
                          placeholder="/custom-route"
                          value={formData.route}
                          onChange={(e) =>
                            setFormData({ ...formData, route: e.target.value })
                          }
                          disabled={!!editingItem}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pageTitle">Page Title *</Label>
                        <Input
                          id="pageTitle"
                          placeholder="Page title"
                          value={formData.pageTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pageTitle: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input
                        id="canonicalUrl"
                        placeholder="https://tripvision.com/page"
                        value={formData.canonicalUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            canonicalUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="robots">Robot Directives</Label>
                      <Select
                        value={formData.robots}
                        onValueChange={(value) =>
                          setFormData({ ...formData, robots: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROBOT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="meta" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        placeholder="SEO title (60 chars recommended)"
                        value={formData.metaTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaTitle: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.metaTitle?.length || 0}/60 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        placeholder="SEO description (160 chars recommended)"
                        rows={3}
                        value={formData.metaDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaDescription: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.metaDescription?.length || 0}/160 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                      <Input
                        id="metaKeywords"
                        placeholder="keyword1, keyword2, keyword3"
                        value={formData.metaKeywords}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metaKeywords: e.target.value,
                          })
                        }
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-6 mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Share2 className="size-4" />
                          Open Graph (Facebook, LinkedIn)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ogTitle">OG Title</Label>
                          <Input
                            id="ogTitle"
                            placeholder="Open Graph title"
                            value={formData.ogTitle}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ogTitle: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ogDescription">OG Description</Label>
                          <Textarea
                            id="ogDescription"
                            placeholder="Open Graph description"
                            rows={2}
                            value={formData.ogDescription}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ogDescription: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ogImage">OG Image URL</Label>
                          <Input
                            id="ogImage"
                            placeholder="https://..."
                            value={formData.ogImage}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ogImage: e.target.value,
                              })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Twitter className="size-4" />
                          Twitter Card
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="twitterTitle">Twitter Title</Label>
                          <Input
                            id="twitterTitle"
                            placeholder="Twitter card title"
                            value={formData.twitterTitle}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                twitterTitle: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitterDescription">
                            Twitter Description
                          </Label>
                          <Textarea
                            id="twitterDescription"
                            placeholder="Twitter card description"
                            rows={2}
                            value={formData.twitterDescription}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                twitterDescription: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitterImage">
                            Twitter Image URL
                          </Label>
                          <Input
                            id="twitterImage"
                            placeholder="https://..."
                            value={formData.twitterImage}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                twitterImage: e.target.value,
                              })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="structuredData">
                        Structured Data (JSON-LD)
                      </Label>
                      <Textarea
                        id="structuredData"
                        placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                        rows={10}
                        value={formData.structuredData}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            structuredData: e.target.value,
                          })
                        }
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter valid JSON-LD schema markup for rich snippets
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : seoSettings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SEO Settings</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding SEO settings for your pages
              </p>
              <Button onClick={openNewDialog}>
                <Plus className="size-4" />
                Add First SEO Setting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Configured Pages</CardTitle>
              <CardDescription>
                SEO settings for {seoSettings.length} page(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Meta Title</TableHead>
                    <TableHead>Robots</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seoSettings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">
                        {item.route}
                      </TableCell>
                      <TableCell>{item.pageTitle}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.metaTitle || "-"}
                      </TableCell>
                      <TableCell className="text-xs">{item.robots}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
