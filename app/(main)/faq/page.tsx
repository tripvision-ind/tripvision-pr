import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to frequently asked questions about our travel packages and services.",
};

async function getFAQs() {
  return prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export default async function FAQPage() {
  const faqs = await getFAQs();

  // Group FAQs by category
  const groupedFAQs = faqs.reduce(
    (acc, faq) => {
      const category = faq.category || "General";
      if (!acc[category]) acc[category] = [];
      acc[category].push(faq);
      return acc;
    },
    {} as Record<string, typeof faqs>,
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our services, bookings, and
            travel packages.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No FAQs yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for answers to common questions.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedFAQs).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <HelpCircle className="size-5 text-primary" />
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
                      {items.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              className="prose prose-sm max-w-none text-muted-foreground"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
