import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Read our travel stories, tips, and guides to help you plan your perfect trip.",
};

async function getBlogs() {
  return prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Travel Blog
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stories, tips, and guides from our travel experts to inspire your
            next adventure.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
              <p className="text-muted-foreground">
                Check back soon for travel stories and tips.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article key={blog.id}>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={blog.heroImage || "/placeholder-blog.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {blog.category && (
                        <Badge className="absolute top-4 left-4">
                          {blog.category}
                        </Badge>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="size-4" />
                          {blog.author}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {truncate(blog.excerpt, 120)}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-primary font-medium text-sm">
                        Read More
                        <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
