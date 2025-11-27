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
			<SheetContent side="right" className="w-full sm:max-w-sm bg-white dark:bg-baseInk">
				<SheetHeader className="border-b border-gray-200 dark:border-white/20 pb-4 mb-4">
					<SheetTitle className="text-left text-xl font-bold text-navyGray dark:text-white">
						Menu
					</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col h-full">
					{/* Menu Items */}
					<nav className="flex-1">
						<ul className="flex flex-col gap-1">
							{menuItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setOpen(false)}
										className={`block px-4 py-3 rounded-md font-medium transition-colors ${
											pathname === item.href
												? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
												: 'text-navyGray dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
										}`}
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Auth Section */}
					<div className="border-t border-gray-200 dark:border-white/20 pt-4 mt-4">
						<div className="flex flex-col gap-3">
							{session?.user ? (
								<>
									<Link
										href="/dashboard"
										onClick={() => setOpen(false)}
										className="block px-4 py-3 rounded-md font-medium text-navyGray dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
									>
										Dashboard
									</Link>
									<button
										onClick={handleSignOut}
										className="bg-black dark:bg-white font-medium text-white dark:text-black text-center px-4 py-2.5 rounded-md hover:opacity-85 transition-opacity cursor-pointer"
									>
										Sign Out
									</button>
								</>
							) : (
								<>
									<Link
										href="/auth/login"
										onClick={() => setOpen(false)}
										className="bg-transparent hover:bg-black dark:hover:bg-white px-4 py-2.5 border border-black dark:border-white font-medium text-black dark:text-white hover:text-white dark:hover:text-black rounded-md text-center transition-colors"
									>
										Sign In
									</Link>
									<Link
										href="/auth/register"
										onClick={() => setOpen(false)}
										className="bg-black dark:bg-white font-medium text-white dark:text-black text-center px-4 py-2.5 rounded-md hover:opacity-85 transition-opacity cursor-pointer"
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
