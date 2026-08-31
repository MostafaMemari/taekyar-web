import { Suspense } from "react";
import { AdminBar } from "@/components/layout/admin-bar";
import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";
import { ScrollReset } from "@/components/layout/scroll-reset";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { Toaster } from "@/components/ui/toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollReset />
      </Suspense>
      <ReadingProgress />
      <Suspense fallback={null}>
        <AdminBar />
      </Suspense>
      <Header />
      <main className="theme-light flex-1 bg-background text-foreground">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}