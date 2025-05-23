import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/header/Header";
import SidebarComponent from "@/components/sidebar/SidebarComponent";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex flex-col w-screen h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SidebarComponent />
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
