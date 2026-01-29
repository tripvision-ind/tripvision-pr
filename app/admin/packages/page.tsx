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
import { Plus, Pencil, Eye, Trash2, Copy } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import DuplicatePackageButton from "./duplicate-button";

async function getPackages() {
  return prisma.package.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      destinations: {
        include: { destination: { select: { name: true } } },
        take: 1,
      },
    },
  });
}

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Packages</h1>
            <p className="text-muted-foreground">
              Manage your travel packages and tours
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/packages/new">
              <Plus className="size-4 mr-2" />
              Add Package
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No packages yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/admin/packages/new">
                        Create your first package
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {pkg.title}
                    </TableCell>
                    <TableCell>
                      {pkg.destinations[0]?.destination.name || "-"}
                    </TableCell>
                    <TableCell>{pkg.duration}</TableCell>
                    <TableCell>
                      {pkg.discountedPrice ? (
                        <div>
                          <span className="font-medium">
                            {formatPrice(Number(pkg.discountedPrice))}
                          </span>
                          <span className="text-muted-foreground line-through text-xs ml-1">
                            {formatPrice(Number(pkg.startingPrice))}
                          </span>
                        </div>
                      ) : (
                        formatPrice(Number(pkg.startingPrice))
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "default" : "secondary"}>
                        {pkg.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pkg.isFeatured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(pkg.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/packages/${pkg.slug}`} target="_blank">
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/packages/${pkg.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <DuplicatePackageButton packageId={pkg.id} />
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
