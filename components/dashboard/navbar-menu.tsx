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

export default function NavbarMenu(){
	const pathname = usePathname();
	const role = useCurrentRole();

	return (
		<NavigationMenu className={'hidden lg:flex ml-6'}>
			<NavigationMenuList className={'gap-1'}>
				<Link href="/dashboard" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('navbar-link', {
							'active': pathname === '/dashboard'
						})}
					>
						Dashboard
					</NavigationMenuLink>
				</Link>
				<NavigationMenuItem>
					<NavigationMenuTrigger
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/products')
						})}
					>
						<NavigationMenuLink>
							Sản phẩm
						</NavigationMenuLink>
					</NavigationMenuTrigger>
					<NavigationMenuContent className={'navbar-dropdown'}>
						<Link
							href="/dashboard/products"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Danh sách
							</NavigationMenuLink>
						</Link>
						<Link
							href="/dashboard/products/add"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Thêm SP
							</NavigationMenuLink>
						</Link>
						<Link
							href="/dashboard/products/categories"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Categories
							</NavigationMenuLink>
						</Link>
						<Link
							href="/dashboard/products/tags"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Tags
							</NavigationMenuLink>
						</Link>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/posts')
						})}
					>
						<NavigationMenuLink>
							Bài viết
						</NavigationMenuLink>
					</NavigationMenuTrigger>
					<NavigationMenuContent className={'navbar-dropdown'}>
						<Link
							href="/dashboard/posts"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Danh sách
							</NavigationMenuLink>
						</Link>
						<Link
							href="/dashboard/posts/add"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Thêm bài
							</NavigationMenuLink>
						</Link>
						<Link
							href="/dashboard/posts/categories"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Categories
							</NavigationMenuLink>
						</Link>
						<Link
							href="/dashboard/posts/tags"
							legacyBehavior passHref
						>
							<NavigationMenuLink>
								Tags
							</NavigationMenuLink>
						</Link>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<Link href="/dashboard/users" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/users')
						})}
					>
						Người dùng
					</NavigationMenuLink>
				</Link>
				<Link href="/dashboard/resources" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/resources')
						})}
					>
						Tài nguyên
					</NavigationMenuLink>
				</Link>
				<Link href="/dashboard/images" legacyBehavior passHref>
					<NavigationMenuLink
						className={cn('navbar-link', {
							'active': pathname.includes('/dashboard/images')
						})}
					>
						Hình ảnh
					</NavigationMenuLink>
				</Link>
			</NavigationMenuList>
		</NavigationMenu>
	)
}
