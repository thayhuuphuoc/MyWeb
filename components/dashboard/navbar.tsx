"use client";

import {UserButton} from "@/components/auth/user-button";
import {useIsFirstRender} from "@uidotdev/usehooks";
import {useEffect} from "react";
import {getProfile} from "@/actions/auth/profile";
import {useSession} from "next-auth/react";
import {logout} from "@/actions/auth/logout";
import SiteLogo from "@/components/logo.site";
import NavbarMenu from "@/components/dashboard/navbar-menu";
import NavbarMenuMobile from "@/components/dashboard/navbar-menu-mobile";

export const Navbar = () => {
	const isFirstRender = useIsFirstRender();
	const {update} = useSession();

	// Check user => (update || logout) | first load
	useEffect(() => {
		if (isFirstRender) {
			getProfile().then(r => {
				if (r.error) {
					logout()
				}
				update()
			})
		}
	}, [])

	return (
		<nav className="z-20 bg-background border-b w-full top-0 left-0">

			<div className="container flex justify-between items-center h-16">
				<div className="flex items-center">
					<NavbarMenuMobile/>
					<SiteLogo href={'/'}/>
					<NavbarMenu/>
				</div>

				<UserButton/>
			</div>
		</nav>
	);
};
