"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DuplicatePackageButton({
  packageId,
}: {
  packageId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDuplicate = async () => {
    if (
      !confirm("Duplicate this package? The copy will be created as a draft.")
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/packages/${packageId}/duplicate`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Package duplicated successfully!");
        router.push(`/admin/packages/${data.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to duplicate package");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDuplicate}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
}
