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
			// Script already exists, dispatch ready event
			window.dispatchEvent(new Event('adsbygoogle-loaded'))
			return // Script already loaded
		}

		// Initialize adsbygoogle array if it doesn't exist
		if (typeof window !== 'undefined') {
			window.adsbygoogle = window.adsbygoogle || []
		}

		// Create script element directly (without Next.js Script component)
		const script = document.createElement('script')
		script.async = true
		script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
		script.crossOrigin = 'anonymous'
		script.setAttribute('data-ad-client', publisherId)
		
		// Add onload handler to dispatch event when script is loaded
		script.onload = () => {
			// Dispatch custom event to notify that AdSense script is ready
			window.dispatchEvent(new Event('adsbygoogle-loaded'))
		}

		// Add onerror handler
		script.onerror = () => {
			if (process.env.NODE_ENV === 'development') {
				console.error('AdSense script failed to load')
			}
		}
		
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


