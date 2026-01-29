import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  return prisma.blog.findUnique({
    where: { slug, isPublished: true },
  });
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return { title: "Article Not Found" };

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[400px] lg:h-[500px]">
        <Image
          src={blog.heroImage || "/placeholder-blog.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="container mx-auto max-w-4xl">
            {blog.category && <Badge className="mb-4">{blog.category}</Badge>}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-1.5">
                <User className="size-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/blogs">
                <ArrowLeft className="size-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <article className="prose prose-lg prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </article>

            {blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="size-4 text-muted-foreground" />
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
