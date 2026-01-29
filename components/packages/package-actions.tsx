"use client";

import { useState } from "react";
import { Share2, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { generatePackagePDF } from "@/lib/pdf-generator";

interface PackageActionsProps {
  pkg: {
    id: string;
    title: string;
    shortDescription?: string | null;
    description: string;
    duration: string;
    category: string;
    startingPrice: number;
    discountedPrice?: number | null;
    destinations?: Array<{
      destination: {
        name: string;
      };
    }>;
    itinerary?: Array<{
      id: string;
      day: number;
      title: string;
      description: string;
    }>;
    hotels?: Array<{
      id: string;
      name: string;
      location: string;
      starRating?: number | null;
      nights: number;
    }>;
    meals?: Array<{
      id: string;
      type: string;
      description?: string | null;
    }>;
    transfers?: Array<{
      id: string;
      type: string;
      description?: string | null;
    }>;
    sightseeing?: Array<{
      id: string;
      name: string;
      description?: string | null;
    }>;
    inclusions?: Array<{
      id: string;
      item: string;
    }>;
    exclusions?: Array<{
      id: string;
      item: string;
    }>;
    activities?: Array<{
      id: string;
      name: string;
      description?: string | null;
      price?: number | null;
      isOptional: boolean;
    }>;
    policies?: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
    }>;
    prices?: Array<{
      id: string;
      price: number;
      discountedPrice?: number | null;
      currency: {
        id: string;
        code: string;
        name: string;
        symbol: string;
        exchangeRate: number;
      };
    }>;
  };
}

export function PackageActions({ pkg }: PackageActionsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple share attempts

    const url = window.location.href;

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: pkg.title,
          text:
            pkg.shortDescription ||
            `Check out this amazing ${pkg.title} package!`,
          url: url,
        });
      } catch (error: any) {
        // Handle AbortError (user canceled) silently
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback to copy link on error
          handleCopyLink();
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      await generatePackagePDF(pkg);
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Share Button */}
        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-black/20 hover:bg-black/30 backdrop-blur-sm border-white/20 text-white hover:text-white h-8 w-8 sm:h-10 sm:w-10"
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              <p>Share this package</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-48" align="end">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Package
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* PDF Export Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/20 hover:bg-black/30 backdrop-blur-sm border-white/20 text-white hover:text-white h-8 w-8 sm:h-10 sm:w-10"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isGeneratingPDF ? "Generating PDF..." : "Download PDF"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
