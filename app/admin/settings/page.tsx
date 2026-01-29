"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BRAND, CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import { Loader2, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface BrandSettings {
  name: string;
  tagline: string;
  description: string;
}

interface ContactSettings {
  primaryPhone: string;
  secondaryPhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  whatsappNumber: string;
}

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    name: BRAND.name,
    tagline: BRAND.tagline,
    description: BRAND.description,
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    primaryPhone: CONTACT.primaryPhone,
    secondaryPhone: CONTACT.secondaryPhone,
    primaryEmail: CONTACT.primaryEmail,
    secondaryEmail: CONTACT.secondaryEmail,
    whatsappNumber: CONTACT.whatsappNumber,
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    metaTitle: `${BRAND.name} - ${BRAND.tagline}`,
    metaDescription: BRAND.description,
    keywords: "",
  });

  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    facebook: SOCIAL_LINKS.facebook,
    instagram: SOCIAL_LINKS.instagram,
    twitter: SOCIAL_LINKS.twitter,
    youtube: SOCIAL_LINKS.youtube,
    linkedin: SOCIAL_LINKS.linkedin,
  });

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.brand) setBrandSettings(data.brand);
          if (data.contact) setContactSettings(data.contact);
          if (data.seo) setSeoSettings(data.seo);
          if (data.social) setSocialSettings(data.social);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async (key: string, value: unknown) => {
    setSaving(key);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your website settings and configuration
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic information about your travel business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={brandSettings.name}
                      onChange={(e) =>
                        setBrandSettings({ ...brandSettings, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={brandSettings.tagline}
                      onChange={(e) =>
                        setBrandSettings({ ...brandSettings, tagline: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={brandSettings.description}
                    onChange={(e) =>
                      setBrandSettings({ ...brandSettings, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <Button
                  onClick={() => saveSettings("brand", brandSettings)}
                  disabled={saving === "brand"}
                >
                  {saving === "brand" ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Your business contact details shown on the website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhone">Primary Phone</Label>
                    <Input
                      id="primaryPhone"
                      value={contactSettings.primaryPhone}
                      onChange={(e) =>
                        setContactSettings({ ...contactSettings, primaryPhone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                    <Input
                      id="secondaryPhone"
                      value={contactSettings.secondaryPhone}
                      onChange={(e) =>
                        setContactSettings({ ...contactSettings, secondaryPhone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryEmail">Primary Email</Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={contactSettings.primaryEmail}
                      onChange={(e) =>
                        setContactSettings({ ...contactSettings, primaryEmail: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryEmail">Secondary Email</Label>
                    <Input
                      id="secondaryEmail"
                      type="email"
                      value={contactSettings.secondaryEmail}
                      onChange={(e) =>
                        setContactSettings({ ...contactSettings, secondaryEmail: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={contactSettings.whatsappNumber}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, whatsappNumber: e.target.value })
                    }
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
                <Button
                  onClick={() => saveSettings("contact", contactSettings)}
                  disabled={saving === "contact"}
                >
                  {saving === "contact" ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Search engine optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Default Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, metaTitle: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">
                    Default Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, metaDescription: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={seoSettings.keywords}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, keywords: e.target.value })
                    }
                    placeholder="travel, tours, vacation, packages"
                  />
                </div>
                <Button
                  onClick={() => saveSettings("seo", seoSettings)}
                  disabled={saving === "seo"}
                >
                  {saving === "seo" ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={socialSettings.facebook}
                      onChange={(e) =>
                        setSocialSettings({ ...socialSettings, facebook: e.target.value })
                      }
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={socialSettings.instagram}
                      onChange={(e) =>
                        setSocialSettings({ ...socialSettings, instagram: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      value={socialSettings.twitter}
                      onChange={(e) =>
                        setSocialSettings({ ...socialSettings, twitter: e.target.value })
                      }
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={socialSettings.youtube}
                      onChange={(e) =>
                        setSocialSettings({ ...socialSettings, youtube: e.target.value })
                      }
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={socialSettings.linkedin}
                    onChange={(e) =>
                      setSocialSettings({ ...socialSettings, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <Button
                  onClick={() => saveSettings("social", socialSettings)}
                  disabled={saving === "social"}
                >
                  {saving === "social" ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}
