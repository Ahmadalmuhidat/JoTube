import { HomeLayout } from "@/modules/home/ui/layouts/home-layout"

interface Layout {
  children: React.ReactNode;
}

export default function Layout({ children }: Layout) {
  return (
    <HomeLayout>
      {children}
    </HomeLayout>
  );
} 