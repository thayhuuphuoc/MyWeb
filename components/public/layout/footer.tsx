import Link from "next/link";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import SiteLogo from "@/components/logo.site";

export default function Footer(){

	return (
		<footer>
			<div className="flex max-lg:flex-col items-center mx-auto max-w-6xl px-5 pt-10 pb-5">
				<div className={'flex-1 max-lg:mb-7'}>
					<SiteLogo/>
				</div>

				<ul className="justify-start items-center gap-5 inline-flex max-lg:flex max-lg:flex-col max-lg:gap-3 font-bold tracking-widest">
					<Link href={'/'} className={'transition-all duration-150 hover:text-blue-500'}>
						trang chủ
					</Link>
					<Link href={'/'} className={'transition-all duration-150 hover:text-blue-500'}>
						blog
					</Link>
					{siteMetadata.social.youtube && (
						<Link target={'_blank'} href={siteMetadata.social.youtube}>
							<Image src={'/icons/youtube-circle.webp'} alt={'youtube'} width={40} height={40}/>
						</Link>
					)}
					{siteMetadata.social.facebook && (
						<Link target={'_blank'} href={siteMetadata.social.facebook}>
							<Image src={'/icons/facebook.png'} alt={'facebook'} width={40} height={40}/>
						</Link>
					)}
					{siteMetadata.social.zalo && (
						<Link target={'_blank'} href={siteMetadata.social.zalo}>
							<Image src={'/icons/zalo.svg'} alt={'zalo'} width={40} height={40}/>
						</Link>
					)}
				</ul>
			</div>
			<div className={'flex flex-col md:flex-row items-center justify-end max-lg:justify-center mx-auto max-w-6xl px-5 pt-5 pb-10 max-lg:text-center gap-2'}>
				<p className={'text-sm'}>
					Copyright © {new Date().getFullYear()} Site by <Link href={'https://vinhweb.com/'} className={'underline'} target={'_blank'}>Vinh Web</Link>.
				</p>
				<p className={'text-sm'}>{siteMetadata.address}</p>
			</div>
		</footer>
	)
}
