import React from "react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";

type SidebarMenuListProps =  {
  title: string,
  items: {
    id: string,
    title: string,
    count?: number
  }[]
}

const SidebarMenuList = ({title, items}:SidebarMenuListProps) => {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible className="group/collapsible">
          <SidebarMenuItem className="list-none">
            <SidebarMenuButton asChild>
              <CollapsibleTrigger className="font-semibold mb-1 w-full">
                {title}
              </CollapsibleTrigger>
            </SidebarMenuButton>

            <ScrollArea className="max-h-[150px]">
              {(items).map(
                (item) => (
                  <CollapsibleContent key={item.id}>
                    <SidebarMenuSub>
                      <SidebarMenuButton asChild>
                        <SidebarMenuSubItem className="pl-2">
                          {item.title}
                          <SidebarMenuBadge>
                            ({item.count})
                          </SidebarMenuBadge>
                        </SidebarMenuSubItem>
                      </SidebarMenuButton>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )
              )}
            </ScrollArea>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarMenuList;
