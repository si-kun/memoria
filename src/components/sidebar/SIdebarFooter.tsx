import React from 'react'

import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronUp, User2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atom/userAtom';

const SIdebarFooter = () => {

    const user = useSetAtom(userAtom);


    const handleSignout = async () => {
        const result = await supabase.auth.signOut();
    
        if (result.error) {
          console.log(result.error);
          return;
        }
    
        user(null);
      };

  return (
    <SidebarFooter className="w-full absolute bottom-0 backdrop-blur-md cursor-pointer">
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

  )
}

export default SIdebarFooter