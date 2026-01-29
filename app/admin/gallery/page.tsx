import { AdminShell } from "@/components/admin/admin-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, FolderOpen } from "lucide-react";

export default function GalleryPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gallery</h1>
            <p className="text-muted-foreground">
              Manage your media files and images
            </p>
          </div>
          <Button>
            <Upload className="size-4 mr-2" />
            Upload Files
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>
              Upload and manage images for your packages, destinations, and
              blogs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ImageIcon className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Upload your media files</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline">
                  <FolderOpen className="size-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground text-center">
                Supported formats: JPG, PNG, WebP, GIF (Max size: 10MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
