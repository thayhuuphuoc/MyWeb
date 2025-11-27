import Link from "next/link";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import {cn} from "@/lib/utils";

export default function SiteLogo({align, href}: {
	align?: 'center',
	href?: string
}){
	return (
		<Link
			className={'text-xl font-semibold block'}
			href={href || '/'}
			title={siteMetadata.logoTitle}
		>
			{/* Logo cho light mode */}
			<Image
				className={cn('block transition-none dark:hidden', {
					'mx-auto my-2': align === 'center'
				})}
				src={siteMetadata.logoSrc || "/images/logo/logo.svg"} 
				alt={siteMetadata.logoTitle} 
				width={135} 
				height={35}
				priority
			/>
			{/* Logo cho dark mode */}
			<Image
				className={cn('hidden transition-none dark:block', {
					'mx-auto my-2': align === 'center'
				})}
				src={siteMetadata.logoDarkSrc || "/images/logo/logo-white.svg"} 
				alt={siteMetadata.logoTitle} 
				width={135} 
				height={35}
				priority
			/>
		</Link>
	)
}
