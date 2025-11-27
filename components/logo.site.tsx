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
			className={'text-xl font-semibold'}
			href={href || '/'}
			title={siteMetadata.logoTitle}
		>
			<Image
				className={cn({
					'block mx-auto my-2': align === 'center'
				})}
				src={siteMetadata.logoSrc} alt={siteMetadata.logoTitle} width={200} height={37}
			/>
		</Link>
	)
}
