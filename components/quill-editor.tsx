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

		// Ensure properties popup is visible when created
		const ensurePopupVisible = () => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				const htmlPopup = popup as HTMLElement
				// Force visibility
				htmlPopup.style.setProperty('display', 'block', 'important')
				htmlPopup.style.setProperty('visibility', 'visible', 'important')
				htmlPopup.style.setProperty('opacity', '1', 'important')
				htmlPopup.style.setProperty('z-index', '10001', 'important')
				htmlPopup.style.setProperty('pointer-events', 'auto', 'important')
				// Remove hidden class if exists
				htmlPopup.classList.remove('ql-hidden')
			})
		}

		// Monitor for popup creation with more aggressive checking
		const observer = new MutationObserver((mutations) => {
			let foundPopup = false
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					// Convert NodeList to Array for iteration (fix TypeScript error)
					Array.from(mutation.addedNodes).forEach((node) => {
						if (node.nodeType === 1) {
							const element = node as Element
							if (element.classList.contains('ql-table-properties-form')) {
								foundPopup = true
							}
							// Also check for nested popups
							const nestedPopup = element.querySelector?.('.ql-table-properties-form')
							if (nestedPopup) {
								foundPopup = true
							}
						}
					})
				}
			})
			
			if (foundPopup) {
				// Use multiple timeouts to ensure popup is visible
				setTimeout(ensurePopupVisible, 0)
				setTimeout(ensurePopupVisible, 50)
				setTimeout(ensurePopupVisible, 100)
			}
		})

		// Observe the editor container and document body for changes
		if (quillRef.current) {
			observer.observe(quillRef.current, {
				childList: true,
				subtree: true
			})
			// Also observe the quill container
			const quillContainer = quill.container
			if (quillContainer) {
				observer.observe(quillContainer, {
					childList: true,
					subtree: true
				})
			}
		}

		// Listen for clicks on table menu items to show popup
		const handleMenuClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			if (target.closest('[data-category="table"], [data-category="cell"]')) {
				setTimeout(() => {
					ensurePopupVisible()
				}, 100)
			}
		}

		if (quillRef.current) {
			quillRef.current.addEventListener('click', handleMenuClick, true)
		}

		// Also check periodically for popups (fallback)
		const checkInterval = setInterval(() => {
			ensurePopupVisible()
		}, 300)

		return () => {
			observer.disconnect()
			clearInterval(checkInterval)
			if (quillRef.current) {
				quillRef.current.removeEventListener('click', handleMenuClick, true)
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
