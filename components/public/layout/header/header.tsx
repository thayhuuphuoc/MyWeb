"use client";

import SiteLogo from "@/components/logo.site";
import PublicNavbarMenu from "@/components/public/layout/header/public-navbar-menu";
import PublicNavbarMenuMobile from "@/components/public/layout/header/public-navbar-menu-mobile";
import { ThemeToggle } from "@/components/public/layout/header/theme-toggle";
import { SearchButton } from "@/components/public/layout/header/search-button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";

export default function Header() {
	const { data: session } = useSession();

	return (
		<header className={"fixed w-full top-0 z-30"}>
			<div className={"bg-white/80 dark:bg-surfaceDark/80 backdrop-blur-md border-b border-border/40"}>
				<div className="container mx-auto px-4 sm:px-7">
					<div className="flex items-center justify-between py-4 gap-4">
						{/* Logo bên trái */}
						<div className="flex-shrink-0">
							<SiteLogo />
						</div>

						{/* Menu ở giữa */}
						<div className="hidden lg:flex flex-1 justify-center min-w-0">
							<PublicNavbarMenu />
						</div>

						{/* Bên phải: Theme, Search, Auth */}
						<div className="flex items-center gap-3 flex-shrink-0">
							{/* Theme Toggle */}
							<ThemeToggle />

							{/* Search Button */}
							<SearchButton />

							{/* Auth Buttons */}
							{session?.user ? (
								<UserButton />
							) : (
								<>
									<Link href="/auth/login">
										<Button
											variant="outline"
											className="hidden lg:flex border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
										>
											Đăng nhập
										</Button>
									</Link>
									<Link href="/auth/register">
										<Button className="hidden lg:flex bg-black dark:bg-white text-white dark:text-black hover:opacity-85">
											Đăng ký
										</Button>
									</Link>
								</>
							)}

							{/* Mobile Menu */}
							<PublicNavbarMenuMobile />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
