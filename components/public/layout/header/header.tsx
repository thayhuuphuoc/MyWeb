import SiteLogo from "@/components/logo.site";
import PublicNavbarMenu from "@/components/public/layout/header/public-navbar-menu";
import PublicNavbarMenuMobile from "@/components/public/layout/header/public-navbar-menu-mobile";

export default function Header(){
	return (
		<header className={'fixed w-full top-0 z-30'}>
			<div className={'bg-white/80 backdrop-blur-md'}>
				<div className="flex items-center mx-auto max-w-6xl px-5 py-4 md:py-6">
					<div className="flex-1">
						<SiteLogo/>
					</div>
					<div className="flex">
						<PublicNavbarMenu/>
						<PublicNavbarMenuMobile/>
					</div>
				</div>
			</div>
		</header>
	)
}
