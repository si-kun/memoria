import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/header/Header";
import SidebarComponent from "@/components/sidebar/SidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex flex-col w-full h-full">
          <Header />
          <div className="w-full h-full flex">
            <SidebarComponent />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
