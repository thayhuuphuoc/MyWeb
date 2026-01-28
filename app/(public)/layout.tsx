import React from "react";
import Header from "@/components/public/layout/header/header";
import Footer from "@/components/public/layout/footer";

import '@/styles/public/index.css'
import '@/styles/public/blog/index.css'
import {GoogleAnalytics} from "@next/third-parties/google";
import AdSenseScript from "@/components/public/adsense/adsense-script";

export default function PublicLayout({
 children,
}: {
	children?: React.ReactNode
}) {
	return (
		<>
			<Header/>
			<main className={'pt-[100px] md:pt-[120px]'}>
				{children}
			</main>
			<Footer/>
			<div className="circle-bg fixed inset-0 -z-10 pointer-events-none dark:hidden">
				<svg
					width={1146}
					height={1146}
					viewBox="0 0 1146 1146"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<circle
						opacity="0.6"
						cx={573}
						cy={573}
						r={573}
						fill="url(#paint0_radial_12_388)"
					/>
					<defs>
						<radialGradient
							id="paint0_radial_12_388"
							cx={0}
							cy={0}
							r={1}
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(573 573) rotate(90) scale(573)"
						>
							<stop stopColor="#bab7df" />
							<stop offset={1} stopColor="#fff" />
						</radialGradient>
					</defs>
				</svg>
			</div>
			{Boolean(process.env.NEXT_PUBLIC_GA_ID) && (
				<GoogleAnalytics gaId={String(process.env.NEXT_PUBLIC_GA_ID)} />
			)}
			{Boolean(process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID) && (
				<AdSenseScript />
			)}
		</>
	)
}
