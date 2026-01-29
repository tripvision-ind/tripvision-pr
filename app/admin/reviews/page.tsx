import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Star, Check, X, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ReviewApprovalActions } from "@/components/admin/review-approval-actions";

async function getReviews() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = reviews.filter((review) => !review.isApproved).length;
  const approvedCount = reviews.filter((review) => review.isApproved).length;

  return {
    reviews,
    stats: {
      pending: pendingCount,
      approved: approvedCount,
      total: reviews.length,
    },
  };
}

export default async function ReviewsPage() {
  const data = await getReviews();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reviews</h1>
            <p className="text-muted-foreground">
              Manage customer reviews and testimonials
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                Total: {data.stats.total}
              </Badge>
              <Badge variant="outline" className="text-sm text-yellow-600">
                Pending: {data.stats.pending}
              </Badge>
              <Badge variant="default" className="text-sm">
                Approved: {data.stats.approved}
              </Badge>
            </div>
            <Button asChild>
              <Link href="/admin/reviews/new">
                <Plus className="size-4 mr-2" />
                Add Review
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Trip Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/admin/reviews/new">
                        Add your first review
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                data.reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{review.name}</p>
                        {review.location && (
                          <p className="text-xs text-muted-foreground">
                            {review.location}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{review.tripType || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {review.content}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {review.isFeatured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <ReviewApprovalActions review={review} />
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/reviews/${review.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminShell>
  );
}
