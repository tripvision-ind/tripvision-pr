"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Review {
  id: string;
  name: string;
  email?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  location?: string | null;
  tripType?: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

interface ReviewApprovalActionsProps {
  review: Review;
}

export function ReviewApprovalActions({ review }: ReviewApprovalActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateReviewStatus = async (
    status: "approve" | "reject" | "feature",
  ) => {
    setIsUpdating(true);

    try {
      let updateData;

      switch (status) {
        case "approve":
          updateData = { isApproved: true };
          break;
        case "reject":
          updateData = { isApproved: false, isFeatured: false };
          break;
        case "feature":
          updateData = { isFeatured: !review.isFeatured, isApproved: true };
          break;
      }

      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update review");

      let message;
      switch (status) {
        case "approve":
          message = "Review approved successfully!";
          break;
        case "reject":
          message = "Review rejected successfully!";
          break;
        case "feature":
          message = review.isFeatured
            ? "Review removed from featured!"
            : "Review featured successfully!";
          break;
      }

      toast.success(message);
      router.refresh();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {!review.isApproved ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => updateReviewStatus("approve")}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Approve Review</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => updateReviewStatus("reject")}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reject Review</p>
            </TooltipContent>
          </Tooltip>
        )}

        {review.isApproved && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={`h-8 w-8 ${
                  review.isFeatured
                    ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
                }`}
                onClick={() => updateReviewStatus("feature")}
                disabled={isUpdating}
              >
                <Star
                  className={`h-4 w-4 ${review.isFeatured ? "fill-current" : ""}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {review.isFeatured ? "Remove from Featured" : "Add to Featured"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
