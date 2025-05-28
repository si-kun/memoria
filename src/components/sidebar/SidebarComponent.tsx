"use client";

import {
  Home,
  NotebookPen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { useAtomValue } from "jotai";
import { folderAtom, tagsAtom } from "@/atom/noteAtom";
import { ScrollArea } from "../ui/scroll-area";
import SidebarMenuList from "./SidebarMenuList";
import SIdebarFooter from "./SIdebarFooter";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "New Note",
    url: "/add-note",
    icon: NotebookPen,
  },
] as const;

const SidebarComponent = () => {
  const folders = useAtomValue(folderAtom);
  const tags = useAtomValue(tagsAtom);
  const pathname = usePathname();

  type ItemUrl = typeof items[number]['url'];

  const isActiveUrl = (itemUrl: ItemUrl, pathname: string) => {
    return itemUrl === "/" ? pathname === "/" : pathname.startsWith(itemUrl)
  }

  return (
    <SidebarProvider>
      <Sidebar className="h-full w-64 relative">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = isActiveUrl(item.url, pathname);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`${isActive ? "bg-green-200" : ""}`}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="px-2">
            <Separator className="px-2" />
          </div>

          <ScrollArea className="h-[calc(100vh-20rem)]">
            <SidebarMenuList
              title="Folders"
              items={folders.map((folder) => ({
                id: folder.id,
                title: folder.folderName,
                count: folder._count.notes,
              }))}
            />

            <SidebarMenuList
              title="Tags"
              items={tags.map((tag) => ({
                id: tag.id,
                title: tag.name,
                count: tag._count.notes,
              }))}
            />
          </ScrollArea>
        </SidebarContent>
        <SIdebarFooter />
      </Sidebar>
    </SidebarProvider>
  );
};

export default SidebarComponent;
