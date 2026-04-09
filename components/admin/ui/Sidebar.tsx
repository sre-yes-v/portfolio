"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	FolderKanban,
	Info,
	Mail,
	Menu,
	Shield,
	X,
} from "lucide-react";

type NavItem = {
	label: string;
	href: string;
	icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
	{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
	{ label: "Manage Project", href: "/admin/projects", icon: FolderKanban },
	{ label: "Manage About", href: "/admin/about", icon: Info },
	{ label: "Messages", href: "/admin/messages", icon: Mail },
];

export default function AdminSidebar({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const isActive = (href: string) =>
		pathname === href || pathname?.startsWith(`${href}/`);

	const navLinkClasses = (href: string) =>
		[
			"flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200",
			isActive(href)
				? "bg-white/10 text-white shadow-lg shadow-black/10"
				: "text-slate-300 hover:bg-white/5 hover:text-white",
		].join(" ");

	const closeMobile = () => setMobileOpen(false);

	return (
		<div className="min-h-screen bg-[radial-gradient(1100px_650px_at_85%_15%,rgba(109,129,255,0.16),transparent_65%),radial-gradient(900px_560px_at_10%_85%,rgba(72,94,198,0.16),transparent_70%),#111522] text-white lg:flex">
			<aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-white/10 lg:bg-white/5 lg:backdrop-blur-xl">
				<div className="border-b border-white/10 px-6 py-6">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
							<Shield className="h-5 w-5" />
						</div>
						<div>
							<p className="text-sm text-slate-400">Admin Panel</p>
							<h1 className="text-lg font-semibold">Sreyes V</h1>
						</div>
					</div>
				</div>

				<nav className="flex-1 space-y-2 px-4 py-6">
					{navItems.map((item) => {
						const Icon = item.icon;

						return (
							<Link key={item.href} href={item.href} className={navLinkClasses(item.href)}>
								<Icon className="h-4 w-4" />
								<span>{item.label}</span>
							</Link>
						);
					})}
				</nav>

				<div className="border-t border-white/10 px-6 py-5 text-xs text-slate-400">
					Manage your portfolio content from one place.
				</div>
			</aside>

			<div className="flex min-h-screen flex-1 flex-col">
				<header className="sticky top-0 z-30 border-b border-white/10 bg-[#111522]/90 backdrop-blur-xl lg:hidden">
					<div className="flex items-center justify-between px-4 py-4 sm:px-6">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Panel</p>
							<h1 className="text-lg font-semibold">Dashboard</h1>
						</div>
						<button
							type="button"
							onClick={() => setMobileOpen((current) => !current)}
							className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
							aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
						>
							{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</header>

				<div className="relative flex flex-1">
					{mobileOpen && (
						<button
							type="button"
							aria-label="Close navigation overlay"
							onClick={closeMobile}
							className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] lg:hidden"
						/>
					)}

					<aside
						className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#111522] px-4 py-5 shadow-2xl shadow-black/30 transition-transform duration-300 lg:hidden ${
							mobileOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						<div className="mb-6 flex items-center justify-between px-2">
							<div className="flex items-center gap-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
									<Shield className="h-5 w-5" />
								</div>
								<div>
									<p className="text-sm text-slate-400">Admin Panel</p>
									<h2 className="text-lg font-semibold">Sreyes V</h2>
								</div>
							</div>
							<button
								type="button"
								onClick={closeMobile}
								className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
								aria-label="Close navigation"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<nav className="space-y-2">
							{navItems.map((item) => {
								const Icon = item.icon;

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={closeMobile}
										className={navLinkClasses(item.href)}
									>
										<Icon className="h-4 w-4" />
										<span>{item.label}</span>
									</Link>
								);
							})}
						</nav>
					</aside>

					<main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
				</div>
			</div>
		</div>
	);
}
