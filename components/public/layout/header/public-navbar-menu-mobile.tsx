'use client'
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { 
	MenuIcon, 
	Home, 
	Info,
	FileText,
	FolderOpen,
	Package, 
	Briefcase, 
	Phone,
	ChevronDown,
	LogIn,
	UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PublicNavbarMenuMobile() {
	const { data: session } = useSession();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

	const menuItems = [
		{ 
			href: '/', 
			label: 'Trang chủ', 
			icon: Home,
			hasDropdown: false
		},
		{ 
			href: '/gioi-thieu', 
			label: 'Giới thiệu', 
			icon: Info,
			hasDropdown: false
		},
		{ 
			href: '/blog', 
			label: 'Blog', 
			icon: FileText,
			hasDropdown: false
		},
		{ 
			href: '/tai-nguyen', 
			label: 'Tài nguyên', 
			icon: FolderOpen,
			hasDropdown: false
		},
		{ 
			href: '/san-pham', 
			label: 'Sản phẩm', 
			icon: Package,
			hasDropdown: false
		},
		{ 
			href: '/dich-vu', 
			label: 'Dịch vụ', 
			icon: Briefcase,
			hasDropdown: false
		},
		{ 
			href: '/contact', 
			label: 'Liên hệ', 
			icon: Phone,
			hasDropdown: false
		},
	];

	const handleSignOut = async () => {
		await signOut();
		setOpen(false);
	};

	const toggleDropdown = (label: string) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(label)) {
			newExpanded.delete(label);
		} else {
			newExpanded.add(label);
		}
		setExpandedItems(newExpanded);
	};

	const isActive = (href: string) => {
		if (href === '/') {
			return pathname === '/';
		}
		return pathname.includes(href);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button size={'icon'} variant={'ghost'} className={'lg:hidden'}>
					<MenuIcon className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-sm bg-white dark:bg-baseInk p-0 [&>button.absolute]:hidden flex flex-col">
				<div className="flex flex-col flex-1 min-h-0">
					{/* Menu Items */}
					<div className="flex-1 overflow-y-auto py-4">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);
							const isExpanded = expandedItems.has(item.label);

							return (
								<div key={item.href + item.label}>
									{item.hasDropdown ? (
										<div>
											<button
												onClick={() => toggleDropdown(item.label)}
												className={cn(
													"w-full flex items-center justify-between py-3.5 px-4 rounded-md font-medium transition-colors",
													"text-navyGray dark:text-white hover:bg-primary/20 hover:text-primary"
												)}
											>
												<div className="flex items-center gap-3">
													<Icon className="h-5 w-5" />
													<span>{item.label}</span>
												</div>
												<ChevronDown 
													className={cn(
														"h-4 w-4 transition-transform",
														isExpanded && "rotate-180"
													)} 
												/>
											</button>
											{isExpanded && (
												<div className="pl-12 pb-2">
													{/* Dropdown content can be added here */}
													<Link
														href={item.href}
														onClick={() => setOpen(false)}
														className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
													>
														Xem tất cả
													</Link>
												</div>
											)}
										</div>
									) : (
										<Link
											href={item.href}
											onClick={() => setOpen(false)}
											className={cn(
												"w-full flex items-center gap-3 py-3.5 px-4 rounded-md font-medium transition-colors",
												active
													? "bg-primary/20 text-primary dark:bg-primary/20 dark:text-primary"
													: "text-navyGray dark:text-white hover:bg-primary/20 hover:text-primary"
											)}
										>
											<Icon className="h-5 w-5" />
											<span>{item.label}</span>
										</Link>
									)}
								</div>
							);
						})}
					</div>

					{/* Auth Section */}
					<div className="border-t border-gray-200 dark:border-white/20 pt-4 pb-4 px-4 flex-shrink-0 space-y-3">
						{session?.user ? (
							<div className="flex flex-col gap-3">
								<Link
									href="/dashboard"
									onClick={() => setOpen(false)}
									className="block px-4 py-3 rounded-md font-medium text-navyGray dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
								>
									Dashboard
								</Link>
								<button
									onClick={handleSignOut}
									className="bg-black dark:bg-white font-medium text-white dark:text-black text-center px-4 py-2 rounded-md hover:opacity-85 transition-opacity cursor-pointer"
								>
									Sign Out
								</button>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								<Link
									href="/auth/login"
									onClick={() => setOpen(false)}
									className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-3 rounded-md transition-colors"
								>
									<LogIn className="h-5 w-5" />
									<span>Đăng nhập</span>
								</Link>
								<Link
									href="/auth/register"
									onClick={() => setOpen(false)}
									className="flex items-center justify-center gap-2 bg-white dark:bg-baseInk border-2 border-orange-500 text-orange-500 font-medium px-4 py-3 rounded-md hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
								>
									<UserPlus className="h-5 w-5" />
									<span>Đăng ký</span>
								</Link>
							</div>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
