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
import { Plus, Pencil, GripVertical } from "lucide-react";

async function getFAQs() {
  return prisma.fAQ.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function FAQsPage() {
  const faqs = await getFAQs();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">FAQs</h1>
            <p className="text-muted-foreground">
              Manage frequently asked questions
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/faqs/new">
              <Plus className="size-4 mr-2" />
              Add FAQ
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No FAQs yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/admin/faqs/new">Add your first FAQ</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <GripVertical className="size-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium max-w-[400px] truncate">
                      {faq.question}
                    </TableCell>
                    <TableCell>
                      {faq.category && (
                        <Badge variant="outline">{faq.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={faq.isActive ? "default" : "secondary"}>
                        {faq.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/faqs/${faq.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
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
