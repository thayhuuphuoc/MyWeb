import {Montserrat, Merriweather, Inter} from "next/font/google";

export const fontBody = Montserrat({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})
export const fontTypo = Inter({
	subsets: ['latin'],
	variable: '--font-serif',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})
