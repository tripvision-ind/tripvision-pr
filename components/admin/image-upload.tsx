"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "general",
  className,
  aspectRatio = "video",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsUploading(true);
      try {
        // Convert file to base64
        const reader = new FileReader();

        reader.onload = async () => {
          const base64 = reader.result as string;

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, folder }),
          });

          if (response.ok) {
            const data = await response.json();
            onChange(data.url);
            toast.success("Image uploaded successfully");
          } else {
            toast.error("Failed to upload image");
          }
          setIsUploading(false);
        };

        reader.onerror = () => {
          toast.error("Failed to read file");
          setIsUploading(false);
        };

        reader.readAsDataURL(file);
      } catch {
        toast.error("Failed to upload image");
        setIsUploading(false);
      }
    },
    [folder, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  if (value) {
    return (
      <div className={cn("relative", aspectRatioClass, className)}>
        <Image
          src={value}
          alt="Uploaded image"
          fill
          className="object-cover rounded-lg"
        />
        {onRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 size-8"
            onClick={onRemove}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        aspectRatioClass,
        className,
      )}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        {isUploading ? (
          <>
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            {isDragActive ? (
              <Upload className="size-8 text-primary" />
            ) : (
              <ImageIcon className="size-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground text-center">
              {isDragActive
                ? "Drop image here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  values = [],
  onChange,
  folder = "general",
  maxImages = 10,
  className,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, folder }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.url;
        } else {
          toast.error("Failed to upload image");
          return null;
        }
      } catch {
        toast.error("Failed to upload image");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [folder],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (values.length >= maxImages) {
          toast.error(`Maximum ${maxImages} images allowed`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const url = await uploadImage(file);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...values, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      }
    },
    [values, maxImages, uploadImage, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    disabled: isUploading || values.length >= maxImages,
  });

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {values.map((url, index) => (
            <div key={index} className="relative aspect-video">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 size-6"
                onClick={() => removeImage(index)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {values.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg cursor-pointer transition-colors p-6",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {isDragActive
                    ? "Drop images here"
                    : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {values.length}/{maxImages} images
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
