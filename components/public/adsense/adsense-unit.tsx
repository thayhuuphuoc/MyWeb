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

	useEffect(() => {
		if (adRef.current && typeof window !== 'undefined') {
			try {
				(window.adsbygoogle = window.adsbygoogle || []).push({})
			} catch (err) {
				if (process.env.NODE_ENV === 'development') {
					console.error('AdSense error:', err)
				}
			}
		}

		// Check if ad loads and hide container if empty
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

