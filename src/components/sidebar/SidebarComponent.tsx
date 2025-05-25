"use client";

import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useAtomValue, useSetAtom } from "jotai";
import { folderAtom, tagsAtom } from "@/atom/noteAtom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { userAtom } from "@/atom/userAtom";
import { supabase } from "@/utils/supabase/client";
import { Folder, Tag } from "@prisma/client";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const SidebarComponent = () => {
  const user = useSetAtom(userAtom);
  const folders = useAtomValue(folderAtom);
  const tags = useAtomValue(tagsAtom);

  const handleSignout = async () => {
    const result = await supabase.auth.signOut();

    if (result.error) {
      console.log(result.error);
      return;
    }

    user(null);
  };

  return (
    <SidebarProvider>
      <Sidebar className="h-full w-64">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Separator />
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem className="list-none">
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger className="font-semibold mb-1 w-full">
                      Folders
                    </CollapsibleTrigger>
                  </SidebarMenuButton>

                  {(folders as (Folder & {_count: {notes: number}})[]).map((folder) => (
                    <CollapsibleContent key={folder.id}>
                      <SidebarMenuSub>
                        <SidebarMenuButton asChild>
                          <SidebarMenuSubItem className="pl-2">
                            {folder.folderName}
                            <SidebarMenuBadge>
                              ({folder._count.notes})
                            </SidebarMenuBadge>
                          </SidebarMenuSubItem>
                        </SidebarMenuButton>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ))}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
          <Separator />
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem className="list-none">
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger className="font-semibold mb-1 w-full">
                      Tags
                    </CollapsibleTrigger>
                  </SidebarMenuButton>

                  {(tags as (Tag & { _count: { notes: number } })[]).map(
                    (tag) => (
                      <CollapsibleContent key={tag.id}>
                        <SidebarMenuSub>
                          <SidebarMenuButton asChild>
                            <SidebarMenuSubItem className="pl-2">
                              {tag.name}
                              <SidebarMenuBadge>
                                ({tag._count.notes})
                              </SidebarMenuBadge>
                            </SidebarMenuSubItem>
                          </SidebarMenuButton>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="w-full">
          <SidebarMenu className="w-full">
            <SidebarMenuItem className="w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full">
                  <SidebarMenuButton className="w-full">
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-50 bg-blue-300"
                  align="center"
                  alignOffset={0}
                  sideOffset={8}
                >
                  <DropdownMenuItem className="w-full">
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="w-full">
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="w-full" onClick={handleSignout}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default SidebarComponent;
