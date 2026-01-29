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
import { Plus, Pencil, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getDestinations() {
  return prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { packages: true } },
    },
  });
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Destinations</h1>
            <p className="text-muted-foreground">
              Manage your travel destinations
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/destinations/new">
              <Plus className="size-4 mr-2" />
              Add Destination
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Packages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No destinations yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/admin/destinations/new">
                        Add your first destination
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                destinations.map((dest) => (
                  <TableRow key={dest.id}>
                    <TableCell className="font-medium">{dest.name}</TableCell>
                    <TableCell>{dest.country}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {dest.isDomestic ? "Domestic" : "International"}
                      </Badge>
                    </TableCell>
                    <TableCell>{dest._count.packages}</TableCell>
                    <TableCell>
                      <Badge variant={dest.isActive ? "default" : "secondary"}>
                        {dest.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dest.isFeatured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(dest.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`/destinations/${dest.slug}`}
                            target="_blank"
                          >
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/destinations/${dest.id}`}>
                            <Pencil className="size-4" />
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
