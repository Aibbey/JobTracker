import { createRootRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FloatingBanner } from "@/components/FloatingBanner";
import {
	LayoutDashboard,
	BarChart3,
	User,
	Settings,
	Briefcase,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const Route = createRootRoute({
	component: Root,
});

const navItems = [
	{ to: "/" as const, label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
	{ to: "/statistics" as const, label: "Statistics", icon: BarChart3, color: "text-emerald-500" },
	{ to: "/profile" as const, label: "Profile", icon: User, color: "text-violet-500" },
	{ to: "/settings" as const, label: "Settings", icon: Settings, color: "text-amber-500" },
];

function Root() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="border-b px-4 py-4">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md">
							<Briefcase className="size-4" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Job Tracker</span>
							<span className="text-xs text-muted-foreground">
								Application Manager
							</span>
						</div>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems.map((item) => {
									const isActive = item.to === "/"
										? currentPath === "/" || currentPath === ""
										: currentPath.startsWith(item.to);
									return (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.label}
										>
											<Link to={item.to}>
												<item.icon className={isActive ? item.color : ""} />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					{(() => {
						const activeItem = navItems.find((item) =>
							item.to === "/"
								? currentPath === "/" || currentPath === ""
								: currentPath.startsWith(item.to),
						);
						return (
							<span className={`text-sm font-medium ${activeItem?.color ?? ""}`}>
								{activeItem?.label ?? "Dashboard"}
							</span>
						);
					})()}
				</header>
				<div className="flex flex-col flex-1 min-h-0">
					<ErrorBoundary tagName="main" className="flex-1">
						<Outlet />
					</ErrorBoundary>
				</div>
			</SidebarInset>
			<TanStackRouterDevtools position="bottom-right" />
			<FloatingBanner position="bottom-left" />
		</SidebarProvider>
	);
}
