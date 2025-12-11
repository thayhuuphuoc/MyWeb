'use client'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function PublicNavbarMenuMobile() {
	const { data: session } = useSession();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const menuItems = [
		{ href: '/', label: 'Trang chủ' },
		{ href: '/gioi-thieu', label: 'Giới thiệu' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/tai-nguyen', label: 'Tài nguyên' },
		{ href: '/san-pham', label: 'Sản phẩm' },
		{ href: '/dich-vu', label: 'Dịch vụ' },
		{ href: '/contact', label: 'Liên hệ' },
	];

	const handleSignOut = async () => {
		await signOut();
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button size={'icon'} variant={'ghost'} className={'lg:hidden'}>
					<MenuIcon className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-sm bg-white dark:bg-baseInk p-0 [&>button.absolute]:hidden flex flex-col">
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/20 flex-shrink-0">
					<h6 className="text-xl font-bold text-navyGray dark:text-white">Menu</h6>
					<button
						className="cursor-pointer"
						onClick={() => setOpen(false)}
						aria-label="Close mobile menu"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="p-4 flex flex-col flex-1 min-h-0">
					{/* Menu Items */}
					<ul className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
						{menuItems.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={() => setOpen(false)}
									className={`block py-1.5 px-2.5 rounded-md font-medium transition-colors ${
										pathname === item.href || (item.href !== '/' && pathname.includes(item.href))
											? 'bg-primary/20 text-primary dark:bg-primary/20 dark:text-primary'
											: 'text-navyGray dark:text-white hover:bg-primary/20 hover:text-primary'
									}`}
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>

					{/* Auth Section */}
					<div className="border-t border-gray-200 dark:border-white/20 pt-5 mt-5 flex-shrink-0">
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
							<div className="flex flex-row gap-3">
								<Link
									href="/auth/login"
									onClick={() => setOpen(false)}
									className="flex-1 bg-transparent hover:bg-black dark:hover:bg-white px-4 py-2 border border-black dark:border-white font-medium text-black dark:text-white hover:text-white dark:hover:text-black rounded-md text-center transition-colors"
								>
									Đăng nhập
								</Link>
								<Link
									href="/auth/register"
									onClick={() => setOpen(false)}
									className="flex-1 bg-black dark:bg-white font-medium text-white dark:text-black text-center px-4 py-2 rounded-md hover:opacity-85 transition-opacity cursor-pointer"
								>
									Đăng ký
								</Link>
							</div>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
