'use client'

import { useEffect } from 'react'

export default function AdSenseScript() {
	const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

	useEffect(() => {
		if (!publisherId || typeof document === 'undefined') return

		// Check if script already exists
		const existingScript = document.querySelector(
			'script[src*="adsbygoogle.js"]'
		)
		
		if (existingScript) {
			return // Script already loaded
		}

		// Create script element directly (without Next.js Script component)
		const script = document.createElement('script')
		script.async = true
		script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
		script.crossOrigin = 'anonymous'
		script.setAttribute('data-ad-client', publisherId)
		
		// Append to head
		document.head.appendChild(script)

		return () => {
			// Cleanup on unmount (optional)
			const scriptToRemove = document.querySelector(
				`script[src*="adsbygoogle.js"]`
			)
			if (scriptToRemove) {
				scriptToRemove.remove()
			}
		}
	}, [publisherId])

	return null
}


