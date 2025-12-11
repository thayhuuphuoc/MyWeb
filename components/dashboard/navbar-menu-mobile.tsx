import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal,
	DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
	Gauge,
	LayoutList,
	Mail,
	MenuIcon,
	MessageSquare, Package,
	PackageSearch, PencilLine,
	PlusCircle,
	ScrollText,
	UserPlus,
	Users,
	UsersRound
} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function NavbarMenuMobile(){
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button size={'icon'} variant={'ghost'} className={'mr-6 lg:hidden'} asChild>
					<MenuIcon  />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-52" align={'start'}>
				<DropdownMenuLabel>
					Menu
				</DropdownMenuLabel>
				<DropdownMenuSeparator/>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/dashboard'}>
						<Gauge className="mr-2 h-4 w-4" />
						Dashboard
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Package className="mr-2 h-4 w-4" />
						<span>Sản phẩm</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/products'}>
									Danh sách
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/products/add'}>
									Thêm SP
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/products/categories'}>
									Categories
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/products/tags'}>
									Tags
								</Link>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<PencilLine className="mr-2 h-4 w-4" />
						<span>Bài viết</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/posts'}>
									Danh sách
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/posts/add'}>
									Thêm bài
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/posts/categories'}>
									Categories
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className={'cursor-pointer'} asChild>
								<Link href={'/dashboard/posts/tags'}>
									Tags
								</Link>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/dashboard/users'}>
						<UsersRound className="mr-2 h-4 w-4" />
						Người dùng
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/dashboard/resources'}>
						<ScrollText className="mr-2 h-4 w-4" />
						Tài nguyên
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/dashboard/images'}>
						<LayoutList className="mr-2 h-4 w-4" />
						Hình ảnh
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
