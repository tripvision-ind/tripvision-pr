import {
  TopInfoBar,
  Navbar,
  Footer,
  QuickEnquiry,
  FloatingButtons,
} from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopInfoBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuickEnquiry />
      <FloatingButtons />
    </div>
  );
}
