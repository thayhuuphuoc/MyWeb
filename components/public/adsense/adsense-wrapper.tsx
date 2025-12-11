'use client'

import { useEffect, useRef, useState } from 'react'
import AdSenseUnit from './adsense-unit'

interface AdSenseWrapperProps {
	adSlot: string
	adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
	className?: string
	wrapperClassName?: string
}

export default function AdSenseWrapper({
	adSlot,
	adFormat = 'auto',
	className = '',
	wrapperClassName = ''
}: AdSenseWrapperProps) {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [shouldHide, setShouldHide] = useState(false)

	useEffect(() => {
		let timeout1: NodeJS.Timeout | null = null
		let timeout2: NodeJS.Timeout | null = null
		let finalCheck: NodeJS.Timeout | null = null
		let observer: MutationObserver | null = null
		let initialDelay: NodeJS.Timeout | null = null

		// Wait a bit for AdSense to initialize
		initialDelay = setTimeout(() => {
			// Check if AdSense element is empty or hidden after delays
			const checkAdVisibility = () => {
				if (wrapperRef.current) {
					const insElement = wrapperRef.current.querySelector('ins.adsbygoogle') as HTMLElement
					if (insElement) {
						const computedStyle = window.getComputedStyle(insElement)
						const isHidden = computedStyle.display === 'none' || 
							computedStyle.visibility === 'hidden' ||
							computedStyle.opacity === '0'
						
						const hasContent = insElement.children.length > 0
						const hasHeight = insElement.offsetHeight > 10
						
						// Hide wrapper if ad is not visible or has no content
						if (isHidden || (!hasContent && !hasHeight)) {
							setShouldHide(true)
						}
					}
				}
			}

			// Check after delays to allow AdSense to load
			timeout1 = setTimeout(checkAdVisibility, 2000)
			timeout2 = setTimeout(checkAdVisibility, 5000)

			// Use MutationObserver to watch for changes
			if (wrapperRef.current) {
				observer = new MutationObserver(checkAdVisibility)
				observer.observe(wrapperRef.current, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ['style', 'class']
				})
			}

			// Final check after 8 seconds - if still no ad, hide wrapper
			finalCheck = setTimeout(() => {
				if (wrapperRef.current) {
					const insElement = wrapperRef.current.querySelector('ins.adsbygoogle') as HTMLElement
					if (!insElement || insElement.offsetHeight <= 10) {
						setShouldHide(true)
					}
				}
			}, 8000)
		}, 500) // Initial 500ms delay to allow component to mount

		return () => {
			if (initialDelay) clearTimeout(initialDelay)
			if (timeout1) clearTimeout(timeout1)
			if (timeout2) clearTimeout(timeout2)
			if (finalCheck) clearTimeout(finalCheck)
			if (observer) {
				observer.disconnect()
			}
		}
	}, [])

	if (shouldHide) {
		return null
	}

	return (
		<div 
			ref={wrapperRef}
			className={wrapperClassName}
		>
			<AdSenseUnit 
				adSlot={adSlot}
				adFormat={adFormat}
				className={className}
			/>
		</div>
	)
}

