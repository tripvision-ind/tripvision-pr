"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, truncate } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  excerpt?: string | null;
  author: string;
  category?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
}

interface BlogsSectionProps {
  title?: string;
  subtitle?: string;
  blogs: Blog[];
}

export function BlogsSection({
  title = "Travel Stories & Tips",
  subtitle = "Explore our collection of travel blogs and guides",
  blogs,
}: BlogsSectionProps) {
  if (blogs.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/blogs/${blog.slug}`}
                className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
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

                {/* Content */}
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
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/blogs">
              View All Articles
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
