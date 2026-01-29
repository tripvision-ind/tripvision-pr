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
import { Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getBlogs() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your travel blog articles
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="size-4 mr-2" />
              Write Article
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No blog posts yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/admin/blogs/new">
                        Write your first article
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">
                      {blog.title}
                    </TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      {blog.category && (
                        <Badge variant="outline">{blog.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={blog.isPublished ? "default" : "secondary"}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {blog.publishedAt ? formatDate(blog.publishedAt) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {blog.isPublished && (
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/blogs/${blog.id}`}>
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
