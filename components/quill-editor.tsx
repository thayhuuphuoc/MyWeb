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

		// Function to show popup when found
		const showPopup = () => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			let found = false
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
			return found
		}

		// Observe document body for popup creation
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					// Convert NodeList to Array for iteration (fix TypeScript error)
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as Element
							// Check if the added node is the popup
							if (element.classList.contains('ql-table-properties-form')) {
								// Immediately show it
								showPopup()
								// Also check after a brief delay to ensure module is done positioning
								setTimeout(showPopup, 10)
								setTimeout(showPopup, 50)
							}
							// Check if popup is nested inside added node
							const nestedPopup = element.querySelector('.ql-table-properties-form')
							if (nestedPopup) {
								showPopup()
								setTimeout(showPopup, 10)
								setTimeout(showPopup, 50)
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
			}
		}

		// Listen on document to catch clicks anywhere
		document.addEventListener('click', handleClick, true)

		// Periodic check as fallback (only if popup exists)
		const checkInterval = setInterval(() => {
			const popup = document.querySelector('.ql-table-properties-form')
			if (popup) {
				showPopup()
			}
		}, 100)

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
