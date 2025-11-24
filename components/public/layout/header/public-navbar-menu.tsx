'use client'

import {
	NavigationMenu, NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {useCurrentRole} from "@/hooks/use-current-role";
import React from "react";

export default function PublicNavbarMenu(){
	const pathname = usePathname();
	const role = useCurrentRole();

	return (
		<NavigationMenu className={'hidden lg:flex'}>
			<NavigationMenuList className={'gap-5 font-bold tracking-widest'}>
				<Link href="/" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('transition-all duration-150 hover:text-blue-500', {
							'active': pathname === ('/')
						})}
					>
						trang chủ
					</NavigationMenuLink>
				</Link>
				<Link href="/san-pham" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('transition-all duration-150 hover:text-blue-500', {
							'active': pathname.includes('/san-pham')
						})}
					>
						sản phẩm
					</NavigationMenuLink>
				</Link>
				<Link href="/blog" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('transition-all duration-150 hover:text-blue-500', {
							'active': pathname.includes('/blog')
						})}
					>
						blog
					</NavigationMenuLink>
				</Link>
				<Link href={`/contact`} className={'h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]'}>
					<div className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]'}>
						liên hệ
					</div>
				</Link>
			</NavigationMenuList>
		</NavigationMenu>
	)
}
