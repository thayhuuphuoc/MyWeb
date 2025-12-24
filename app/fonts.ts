import {Montserrat, Inter} from "next/font/google";

// Tối ưu: chỉ load các weights cần thiết (400=normal/medium, 700=bold, 900=black)
export const fontBody = Montserrat({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400', '700', '900'],
	display: 'swap', // Tối ưu font loading
	preload: true,
})

export const fontTypo = Inter({
	subsets: ['latin'],
	variable: '--font-serif',
	weight: ['400', '700', '900'],
	display: 'swap',
	preload: true,
})

export const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	preload: true,
})
