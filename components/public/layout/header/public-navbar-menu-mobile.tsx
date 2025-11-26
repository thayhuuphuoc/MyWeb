'use client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function PublicNavbarMenuMobile() {
	const { data: session } = useSession();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size={'icon'} variant={'ghost'} className={'lg:hidden'}>
					<MenuIcon className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-52 font-bold tracking-widest" align={'end'}>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/'}>
						trang chủ
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/gioi-thieu'}>
						giới thiệu
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/dich-vu'}>
						dịch vụ
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className={'cursor-pointer'} asChild>
					<Link href={'/contact'}>
						liên hệ
					</Link>
				</DropdownMenuItem>
				{session?.user ? (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem className={'cursor-pointer'} asChild>
							<Link href={'/dashboard'}>
								Dashboard
							</Link>
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem className={'cursor-pointer'} asChild>
							<Link href={'/auth/login'}>
								Sign In
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className={'cursor-pointer'} asChild>
							<Link href={'/auth/register'}>
								Sign Up
							</Link>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
