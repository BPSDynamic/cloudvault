import { 
  FolderOpen, 
  User, 
  Settings, 
  Upload, 
  Trash2,
  Share2,
  HardDrive,
  BarChart3,
  Cloud
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { 
    title: "My Files", 
    url: "/dashboard", 
    icon: FolderOpen,
    badge: null,
    description: "Browse your files"
  },
  { 
    title: "Share Files", 
    url: "/dashboard/share", 
    icon: Upload,
    badge: null,
    description: "Share files with others"
  },
  { 
    title: "Shared", 
    url: "/dashboard/shared", 
    icon: Share2,
    badge: "3",
    description: "Files shared with you"
  },
  { 
    title: "Folders", 
    url: "/dashboard/folders", 
    icon: FolderOpen,
    badge: null,
    description: "Organize in folders"
  },
  { 
    title: "Trash", 
    url: "/dashboard/trash", 
    icon: Trash2,
    badge: null,
    description: "Deleted items"
  },
];

const settingsItems = [
  { 
    title: "Storage", 
    url: "/dashboard/storage", 
    icon: HardDrive,
    badge: "2.4GB",
    description: "Manage storage"
  },
  { 
    title: "Profile", 
    url: "/dashboard/profile", 
    icon: User,
    badge: null,
    description: "Your profile"
  },
  { 
    title: "Settings", 
    url: "/dashboard/settings", 
    icon: Settings,
    badge: null,
    description: "App settings"
  },
];

const enterpriseItems = [
  { 
    title: "Enterprise", 
    url: "/dashboard/enterprise", 
    icon: BarChart3,
    badge: "Pro",
    description: "Analytics & insights"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard";
    }
    // Use exact match for specific paths to avoid conflicts
    if (path === "/dashboard/share") {
      return currentPath === "/dashboard/share";
    }
    if (path === "/dashboard/shared") {
      return currentPath === "/dashboard/shared";
    }
    if (path === "/dashboard/folders") {
      return currentPath === "/dashboard/folders";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar 
      className="border-r border-border/50 bg-gradient-to-b from-background to-muted/20" 
      role="navigation" 
      aria-label="Main navigation"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/50">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-105">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                <span className="font-bold text-base tracking-tight truncate">CloudVault</span>
                <span className="text-[10px] text-muted-foreground truncate">Enterprise Cloud Storage</span>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Files
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={`
                        relative group transition-all duration-200
                        ${active 
                          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                          : "hover:bg-muted/80 hover:text-foreground"
                        }
                      `}
                    >
                      <NavLink to={item.url} end={item.url === "/dashboard"}>
                        <item.icon className={`h-4 w-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                        {!collapsed && (
                          <span className="flex-1 truncate animate-in fade-in slide-in-from-left-1 duration-200">
                            {item.title}
                          </span>
                        )}
                        {!collapsed && item.badge && (
                          <Badge 
                            variant={active ? "secondary" : "outline"} 
                            className="ml-auto h-5 px-1.5 text-[10px] font-medium animate-in fade-in zoom-in-50 duration-200"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-foreground rounded-r-full animate-in slide-in-from-left-1 duration-200" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={`
                        relative group transition-all duration-200
                        ${active 
                          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                          : "hover:bg-muted/80 hover:text-foreground"
                        }
                      `}
                    >
                      <NavLink to={item.url}>
                        <item.icon className={`h-4 w-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                        {!collapsed && (
                          <span className="flex-1 truncate animate-in fade-in slide-in-from-left-1 duration-200">
                            {item.title}
                          </span>
                        )}
                        {!collapsed && item.badge && (
                          <Badge 
                            variant={active ? "secondary" : "outline"} 
                            className="ml-auto h-5 px-1.5 text-[10px] font-medium animate-in fade-in zoom-in-50 duration-200"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-foreground rounded-r-full animate-in slide-in-from-left-1 duration-200" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            Enterprise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {enterpriseItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={`
                        relative group transition-all duration-200
                        ${active 
                          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                          : "hover:bg-muted/80 hover:text-foreground"
                        }
                      `}
                    >
                      <NavLink to={item.url}>
                        <item.icon className={`h-4 w-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                        {!collapsed && (
                          <span className="flex-1 truncate animate-in fade-in slide-in-from-left-1 duration-200">
                            {item.title}
                          </span>
                        )}
                        {!collapsed && item.badge && (
                          <Badge 
                            variant={active ? "secondary" : "default"} 
                            className="ml-auto h-5 px-1.5 text-[10px] font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 animate-in fade-in zoom-in-50 duration-200"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-foreground rounded-r-full animate-in slide-in-from-left-1 duration-200" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {!collapsed && (
          <div className="rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">System Status</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              All systems operational
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}