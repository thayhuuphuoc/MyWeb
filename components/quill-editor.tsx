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

		// Function to show popup - based on module source code, class is .ql-table-properties-form
		const showPopup = (popup?: HTMLElement) => {
			// If popup element provided, use it directly
			if (popup && popup.isConnected) {
				popup.classList.remove('ql-hidden')
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
				popup.style.setProperty('pointer-events', 'auto', 'important')
				popup.style.setProperty('position', 'absolute', 'important')
				const currentZIndex = popup.style.zIndex ? parseInt(popup.style.zIndex) : 0
				if (currentZIndex < 10000) {
					popup.style.setProperty('z-index', '10001', 'important')
				}
				return true
			}

			// Otherwise search for popup in quill.container (where module appends it)
			const popups = quill.container.querySelectorAll('.ql-table-properties-form')
			let found = false
			popups.forEach((popup) => {
				const htmlPopup = popup as HTMLElement
				if (htmlPopup && htmlPopup.isConnected) {
					htmlPopup.classList.remove('ql-hidden')
					htmlPopup.style.setProperty('display', 'block', 'important')
					htmlPopup.style.setProperty('visibility', 'visible', 'important')
					htmlPopup.style.setProperty('opacity', '1', 'important')
					htmlPopup.style.setProperty('pointer-events', 'auto', 'important')
					htmlPopup.style.setProperty('position', 'absolute', 'important')
					const currentZIndex = htmlPopup.style.zIndex ? parseInt(htmlPopup.style.zIndex) : 0
					if (currentZIndex < 10000) {
						htmlPopup.style.setProperty('z-index', '10001', 'important')
					}
					found = true
				}
			})
			return found
		}

		// Observe quill.container specifically (popup is appended here per module source code)
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					// Convert NodeList to Array for iteration
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as Element
							// Check if the added node is the popup
							if (element.classList.contains('ql-table-properties-form')) {
								// Immediately show it
								showPopup(element as HTMLElement)
								// Also ensure it stays visible after module's positioning logic runs
								setTimeout(() => showPopup(element as HTMLElement), 0)
								setTimeout(() => showPopup(element as HTMLElement), 50)
							}
							// Check if popup is nested inside added node
							const nestedPopup = element.querySelector('.ql-table-properties-form')
							if (nestedPopup) {
								showPopup(nestedPopup as HTMLElement)
								setTimeout(() => showPopup(nestedPopup as HTMLElement), 0)
								setTimeout(() => showPopup(nestedPopup as HTMLElement), 50)
							}
						}
					}
				}
			}
		})

		// Observe quill.container where popup is appended (per module source code line 456)
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true
			})
		}

		// Listen for clicks on table/cell menu items
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			const menuItem = target.closest('[data-category="table"], [data-category="cell"]')
			if (menuItem) {
				// Module creates popup synchronously, but check with delays to ensure visibility
				setTimeout(() => showPopup(), 0)
				setTimeout(() => showPopup(), 50)
				setTimeout(() => showPopup(), 100)
				setTimeout(() => showPopup(), 200)
			}
		}

		// Listen on quill.container to catch clicks on menu items
		if (quill.container) {
			quill.container.addEventListener('click', handleClick, true)
		}

		// Periodic check as fallback
		const checkInterval = setInterval(() => {
			showPopup()
		}, 300)

		return () => {
			observer.disconnect()
			clearInterval(checkInterval)
			if (quill.container) {
				quill.container.removeEventListener('click', handleClick, true)
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
