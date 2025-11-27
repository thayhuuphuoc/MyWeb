'use client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal,
	DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
	MenuIcon,
} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function PublicNavbarMenuMobile(){
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button size={'icon'} variant={'ghost'} className={'lg:hidden'} asChild>
					<MenuIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-52 font-bold tracking-widest" align={'end'}>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/'}>
						trang chủ
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/san-pham'}>
						sản phẩm
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/blog'}>
						blog
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/contact'}>
						liên hệ
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
