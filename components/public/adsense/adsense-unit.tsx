'use client'

import { useEffect, useRef, useState } from 'react'

interface AdSenseUnitProps {
	adSlot: string
	adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
	style?: React.CSSProperties
	className?: string
}

declare global {
	interface Window {
		adsbygoogle: any[]
	}
}

export default function AdSenseUnit({ 
	adSlot, 
	adFormat = 'auto',
	style = { display: 'block' },
	className = ''
}: AdSenseUnitProps) {
	const adRef = useRef<HTMLModElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [shouldHide, setShouldHide] = useState(false)
	const [scriptLoaded, setScriptLoaded] = useState(false)

	// Check if AdSense script is already loaded
	useEffect(() => {
		if (typeof window === 'undefined') return

		// Check if script is already in DOM
		const checkScriptLoaded = () => {
			const script = document.querySelector('script[src*="adsbygoogle.js"]')
			if (script && window.adsbygoogle) {
				setScriptLoaded(true)
				return true
			}
			return false
		}

		// Check immediately
		if (checkScriptLoaded()) {
			return
		}

		// Listen for script load event
		const handleScriptLoad = () => {
			setScriptLoaded(true)
		}

		window.addEventListener('adsbygoogle-loaded', handleScriptLoad)

		// Also check periodically in case event was missed
		const checkInterval = setInterval(() => {
			if (checkScriptLoaded()) {
				clearInterval(checkInterval)
				window.removeEventListener('adsbygoogle-loaded', handleScriptLoad)
			}
		}, 100)

		// Cleanup after 10 seconds
		const timeout = setTimeout(() => {
			clearInterval(checkInterval)
			window.removeEventListener('adsbygoogle-loaded', handleScriptLoad)
		}, 10000)

		return () => {
			clearInterval(checkInterval)
			clearTimeout(timeout)
			window.removeEventListener('adsbygoogle-loaded', handleScriptLoad)
		}
	}, [])

	// Push ad to AdSense after script is loaded
	useEffect(() => {
		if (!scriptLoaded || !adRef.current || typeof window === 'undefined') {
			return
		}

		// Wait a bit more to ensure script is fully initialized
		const pushAd = () => {
			try {
				if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
					window.adsbygoogle.push({})
				} else {
					// Retry if adsbygoogle is not ready
					setTimeout(pushAd, 100)
				}
			} catch (err) {
				if (process.env.NODE_ENV === 'development') {
					console.error('AdSense error:', err)
				}
			}
		}

		// Small delay to ensure script is fully ready
		const timeout = setTimeout(pushAd, 100)
		return () => clearTimeout(timeout)
	}, [scriptLoaded])

	// Check if ad loads and hide container if empty
	useEffect(() => {
		if (typeof window === 'undefined') return

		const checkAdLoaded = () => {
			if (containerRef.current) {
				const insElement = containerRef.current.querySelector('ins.adsbygoogle') as HTMLElement
				if (insElement) {
					const computedStyle = window.getComputedStyle(insElement)
					const isHidden = computedStyle.display === 'none' || 
						computedStyle.visibility === 'hidden' ||
						computedStyle.opacity === '0'
					
					const hasContent = insElement.children.length > 0
					const hasHeight = insElement.offsetHeight > 10 // At least 10px height
					
					// If ad is hidden or has no content/height, hide container
					if (isHidden || (!hasContent && !hasHeight)) {
						setShouldHide(true)
					}
				}
			}
		}

		// Check immediately and after delays
		checkAdLoaded()
		const timeout1 = setTimeout(checkAdLoaded, 2000)
		const timeout2 = setTimeout(checkAdLoaded, 5000)

		// Use MutationObserver to watch for changes
		let observer: MutationObserver | null = null
		if (containerRef.current) {
			observer = new MutationObserver(checkAdLoaded)
			observer.observe(containerRef.current, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['style', 'class']
			})
		}

		return () => {
			clearTimeout(timeout1)
			clearTimeout(timeout2)
			if (observer) {
				observer.disconnect()
			}
		}
	}, [])

	const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

	if (!publisherId) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('AdSense: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set')
		}
		return null
	}

	if (shouldHide) {
		return null
	}

	return (
		<div 
			ref={containerRef}
			className={`adsense-container ${className}`}
			style={{
				...style,
				minHeight: 0,
				lineHeight: 0,
			}}
		>
			<ins
				ref={adRef}
				className="adsbygoogle"
				style={{ 
					display: 'block',
					minHeight: 0,
					lineHeight: 0,
				}}
				data-ad-client={publisherId}
				data-ad-slot={adSlot}
				data-ad-format={adFormat}
				data-full-width-responsive="true"
			/>
		</div>
	)
}

