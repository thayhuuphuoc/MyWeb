"use client"

import React, {useEffect, useRef} from "react";
import '@/styles/quill/quill.css'
import 'quill-table-better/dist/quill-table-better.css'
import '@/styles/quill/table-custom.css'
import 'highlight.js/styles/github-dark-dimmed.min.css'
import Quill from "quill";
import {QuillConfig} from "@/config/quill-config";


export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string,
	defaultValue?: string,
	formats?: string[],
	id?: string,
	onChange: (data: any) => void,
	value?: string,
}

const QuillEditor = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
	const quillRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if(!quillRef.current) return

		const quill = new Quill(quillRef.current, {
			theme: 'snow',
			modules: QuillConfig
		})

		quill.setContents(quill.clipboard.convert({html: props.value || props.defaultValue}), 'silent')

		quill.on('editor-change', () => props.onChange(quill.getSemanticHTML()))

		// Get table-better module instance
		const tableModule = quill.getModule('table-better')

		// Function to show popup - try multiple selectors as module may use different class names
		const showPopup = () => {
			// Try multiple possible selectors for popup
			const selectors = [
				'.ql-table-properties-form',
				'.ql-table-better-properties',
				'[class*="ql-table-properties"]',
				'[class*="table-properties"]',
				'[class*="cell-properties"]',
				'[class*="properties-form"]'
			]
			
			let found = false
			for (const selector of selectors) {
				const popups = document.querySelectorAll(selector)
				popups.forEach((popup) => {
					const htmlPopup = popup as HTMLElement
					if (htmlPopup && htmlPopup.isConnected) {
						// Remove hidden class immediately
						htmlPopup.classList.remove('ql-hidden')
						// Force visibility with important flags
						htmlPopup.style.setProperty('display', 'block', 'important')
						htmlPopup.style.setProperty('visibility', 'visible', 'important')
						htmlPopup.style.setProperty('opacity', '1', 'important')
						htmlPopup.style.setProperty('pointer-events', 'auto', 'important')
						htmlPopup.style.setProperty('position', 'absolute', 'important')
						if (!htmlPopup.style.zIndex || parseInt(htmlPopup.style.zIndex) < 10000) {
							htmlPopup.style.setProperty('z-index', '10001', 'important')
						}
						found = true
					}
				})
			}
			return found
		}

		// Observe document body for popup creation - check for any properties-related element
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					// Convert NodeList to Array for iteration (fix TypeScript error)
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as Element
							// Check multiple possible class patterns
							const classList = element.classList
							if (classList.contains('ql-table-properties-form') ||
								classList.contains('ql-table-better-properties') ||
								Array.from(classList).some(c => c.includes('properties-form') || c.includes('table-properties') || c.includes('cell-properties'))) {
								// Immediately show it
								showPopup()
								// Also check after delays
								setTimeout(showPopup, 10)
								setTimeout(showPopup, 50)
								setTimeout(showPopup, 100)
							}
							// Check if popup is nested inside added node
							const nestedSelectors = [
								'.ql-table-properties-form',
								'.ql-table-better-properties',
								'[class*="properties-form"]'
							]
							for (const selector of nestedSelectors) {
								const nestedPopup = element.querySelector(selector)
								if (nestedPopup) {
									showPopup()
									setTimeout(showPopup, 10)
									setTimeout(showPopup, 50)
									break
								}
							}
						}
					}
				}
			}
		})

		// Observe document body (popup may be appended to body, not quill container)
		observer.observe(document.body, {
			childList: true,
			subtree: true
		})

		// Also observe quill container as fallback
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true
			})
		}

		// Listen for clicks on menu items - wait for module to create popup
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			const menuItem = target.closest('[data-category="table"], [data-category="cell"]')
			if (menuItem) {
				// Module creates popup asynchronously, check multiple times with increasing delays
				setTimeout(() => showPopup(), 10)
				setTimeout(() => showPopup(), 50)
				setTimeout(() => showPopup(), 100)
				setTimeout(() => showPopup(), 200)
				setTimeout(() => showPopup(), 300)
				setTimeout(() => showPopup(), 500)
			}
		}

		// Listen on document to catch clicks anywhere
		document.addEventListener('click', handleClick, true)

		// Periodic check as fallback - check for any popup
		const checkInterval = setInterval(() => {
			showPopup()
		}, 200)

		return () => {
			observer.disconnect()
			clearInterval(checkInterval)
			document.removeEventListener('click', handleClick, true)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
