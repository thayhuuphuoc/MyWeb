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
	Package, 
	Briefcase, 
	Newspaper, 
	Phone,
	LogIn,
	UserPlus,
	Info,
	FolderOpen
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

	const menuItems = [
		{ 
			href: '/', 
			label: 'Trang chủ', 
			icon: Home,
		},
		{ 
			href: '/gioi-thieu', 
			label: 'Giới thiệu', 
			icon: Info,
		},
		{ 
			href: '/blog', 
			label: 'Blog', 
			icon: Newspaper,
		},
		{ 
			href: '/tai-nguyen', 
			label: 'Tài nguyên', 
			icon: FolderOpen,
		},
		{ 
			href: '/san-pham', 
			label: 'Sản phẩm', 
			icon: Package,
		},
		{ 
			href: '/dich-vu', 
			label: 'Dịch vụ', 
			icon: Briefcase,
		},
		{ 
			href: '/contact', 
			label: 'Liên hệ', 
			icon: Phone,
		},
	];

	const handleSignOut = async () => {
		await signOut();
		setOpen(false);
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
			<SheetContent side="right" className="w-full sm:max-w-sm bg-white p-0 [&>button.absolute]:hidden flex flex-col">
				<div className="flex flex-col flex-1 min-h-0">
					{/* Menu Items */}
					<div className="flex-1 overflow-y-auto py-4">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);

							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setOpen(false)}
									className={cn(
										"w-full flex items-center gap-3 py-3.5 px-4 transition-colors",
										active
											? "bg-purple-100 text-purple-700"
											: "text-black hover:bg-gray-50"
									)}
								>
									<Icon className="h-5 w-5" />
									<span className="font-medium">{item.label}</span>
								</Link>
							);
						})}
					</div>

					{/* Auth Section */}
					<div className="border-t border-gray-200 pt-4 pb-4 px-4 flex-shrink-0 space-y-3">
						{session?.user ? (
							<div className="flex flex-col gap-3">
								<Link
									href="/dashboard"
									onClick={() => setOpen(false)}
									className="block px-4 py-3 rounded-md font-medium text-navyGray hover:bg-gray-100 transition-colors"
								>
									Dashboard
								</Link>
								<button
									onClick={handleSignOut}
									className="bg-black font-medium text-white text-center px-4 py-2 rounded-md hover:opacity-85 transition-opacity cursor-pointer"
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
									className="flex items-center justify-center gap-2 bg-white border-2 border-orange-500 text-orange-500 font-medium px-4 py-3 rounded-md hover:bg-orange-50 transition-colors"
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
