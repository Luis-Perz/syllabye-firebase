import { Outlet, NavLink } from "react-router-dom";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/shadcn/ui/sidebar";


const pages = [
    { name: "Syllabus Storage", path: "syllabus-storage" },
    { name: "Professor Management", path: "professor-management" },
];

function AppLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar collapsible="none" className="border-r">
                    <SidebarContent className="p-3">
                        <nav className="flex flex-col gap-1">
                            {pages.map((page) => (
                                <NavLink
                                    key={page.path}
                                    to={`/app/${page.path}`}
                                    className={({ isActive }) =>
                                        `rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
                                            isActive
                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                        }`
                                    }
                                >
                                    {page.name}
                                </NavLink>
                            ))}
                        </nav>
                    </SidebarContent>
                </Sidebar>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}

export default AppLayout;