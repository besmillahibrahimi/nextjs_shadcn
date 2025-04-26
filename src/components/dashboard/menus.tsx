"use client";

import { ChevronRight, MoreHorizontal } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  sidebarMenuButtonVariants,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function MenuGroups({
  menus,
}: {
  menus: MenuGroup[];
}) {
  const { isMobile } = useSidebar();
  return menus.map((menu) => (
    <SidebarGroup key={menu.label?.toString()}>
      <SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
      <SidebarMenu>
        {menu.menus.map((item) => {
          if ("type" in item) {
            if (item.type === "dropdown")
              return (
                <SidebarMenuItem key={item.label?.toString()}>
                  <SidebarMenuButton asChild>
                    <Item menu={item} />
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      {" "}
                      {item.menus?.map((subItem) => (
                        <DropdownMenuItem key={subItem.label?.toString()}>
                          <Icon icon={item.icon} />
                          <span>{subItem.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            return (
              <Collapsible key={item.label?.toString()} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.label?.toString()}>
                    <Item menu={item} />
                  </SidebarMenuButton>
                  {item.menus?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.menus?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.label?.toString()}>
                              <SidebarMenuSubButton asChild>
                                <Item menu={subItem} />
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.label?.toString()}>
              <SidebarMenuButton asChild tooltip={item.label?.toString()}>
                <Item menu={item} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  ));
}

function Item({
  menu,
  size,
  variant,
  className,
}: { menu: Menu; className?: string } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const item = (
    <>
      {menu.icon && <Icon icon={menu.icon} />}
      <span>{menu.label}</span>
    </>
  );

  return menu.href ? (
    <Link className={cn(sidebarMenuButtonVariants({ variant, size }), className)} href={menu.href}>
      {item}
    </Link>
  ) : (
    item
  );
}
