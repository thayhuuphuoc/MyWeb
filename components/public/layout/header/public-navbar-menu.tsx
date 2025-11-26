'use client'

import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

export default function PublicNavbarMenu(){
	const pathname = usePathname();

	return (
		<nav className={'hidden lg:flex'}>
			<ul className={'flex items-center gap-4 text-sm font-medium whitespace-nowrap'}>
				<li>
					<Link
						href="/"
						className={cn('px-2 py-2 transition-all duration-150 hover:text-primary', {
							'text-primary font-semibold': pathname === '/',
							'text-foreground': pathname !== '/'
						})}
					>
						Trang chủ
					</Link>
				</li>
				<li>
					<Link
						href="/gioi-thieu"
						className={cn('px-2 py-2 transition-all duration-150 hover:text-primary', {
							'text-primary font-semibold': pathname.includes('/gioi-thieu'),
							'text-foreground': !pathname.includes('/gioi-thieu')
						})}
					>
						Giới thiệu
					</Link>
				</li>
				<li>
					<Link
						href="/dich-vu"
						className={cn('px-2 py-2 transition-all duration-150 hover:text-primary', {
							'text-primary font-semibold': pathname.includes('/dich-vu'),
							'text-foreground': !pathname.includes('/dich-vu')
						})}
					>
						Dịch vụ
					</Link>
				</li>
				<li>
					<Link
						href="/contact"
						className={cn('px-2 py-2 transition-all duration-150 hover:text-primary', {
							'text-primary font-semibold': pathname.includes('/contact'),
							'text-foreground': !pathname.includes('/contact')
						})}
					>
						Liên hệ
					</Link>
				</li>
			</ul>
		</nav>
	)
}
