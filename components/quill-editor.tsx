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
				
				// Check if popup is actually visible in DOM
				if (!htmlPopup.isConnected) return
				
				// Force visibility - but preserve position set by module
				const currentLeft = htmlPopup.style.left
				const currentTop = htmlPopup.style.top
				
				htmlPopup.style.setProperty('display', 'block', 'important')
				htmlPopup.style.setProperty('visibility', 'visible', 'important')
				htmlPopup.style.setProperty('opacity', '1', 'important')
				htmlPopup.style.setProperty('z-index', '10001', 'important')
				htmlPopup.style.setProperty('pointer-events', 'auto', 'important')
				htmlPopup.style.setProperty('position', 'absolute', 'important')
				
				// Restore position if it was set
				if (currentLeft) htmlPopup.style.setProperty('left', currentLeft, 'important')
				if (currentTop) htmlPopup.style.setProperty('top', currentTop, 'important')
				
				// Remove hidden class if exists
				htmlPopup.classList.remove('ql-hidden')
				
				// Ensure parent container allows visibility
				const parent = htmlPopup.parentElement
				if (parent) {
					if (parent.classList.contains('ql-hidden')) {
						parent.classList.remove('ql-hidden')
					}
					parent.style.setProperty('overflow', 'visible', 'important')
				}
			})
		}

		// Monitor for popup creation with more aggressive checking
		const observer = new MutationObserver((mutations) => {
			let foundPopup = false
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1) {
							const element = node as Element
							if (element.classList.contains('ql-table-properties-form')) {
								foundPopup = true
								// Immediately ensure visibility
								ensurePopupVisible()
							}
							// Also check for nested popups
							const nestedPopup = element.querySelector?.('.ql-table-properties-form')
							if (nestedPopup) {
								foundPopup = true
								ensurePopupVisible()
							}
						}
					})
				}
				// Also check for attribute changes (like class changes)
				if (mutation.type === 'attributes' && mutation.target) {
					const target = mutation.target as Element
					if (target.classList.contains('ql-table-properties-form')) {
						foundPopup = true
						ensurePopupVisible()
					}
				}
			})
			
			if (foundPopup) {
				// Use multiple timeouts to ensure popup is visible after positioning
				setTimeout(ensurePopupVisible, 0)
				setTimeout(ensurePopupVisible, 100)
				setTimeout(ensurePopupVisible, 200)
				setTimeout(ensurePopupVisible, 300)
			}
		})

		// Observe the editor container and document body for changes
		if (quillRef.current) {
			observer.observe(quillRef.current, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class', 'style']
			})
			// Also observe the quill container
			const quillContainer = quill.container
			if (quillContainer) {
				observer.observe(quillContainer, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ['class', 'style']
				})
			}
		}
		
		// Also observe document body in case popup is added there
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Listen for clicks on table menu items to show popup
		const handleMenuClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			const menuItem = target.closest('[data-category="table"], [data-category="cell"]')
			if (menuItem) {
				// Wait a bit for popup to be created by module
				setTimeout(() => {
					ensurePopupVisible()
				}, 50)
				setTimeout(() => {
					ensurePopupVisible()
				}, 150)
				setTimeout(() => {
					ensurePopupVisible()
				}, 300)
			}
		}

		if (quillRef.current) {
			quillRef.current.addEventListener('click', handleMenuClick, true)
		}
		
		// Also listen on document for menu clicks (in case menu is outside quillRef)
		document.addEventListener('click', handleMenuClick, true)

		// Also check periodically for popups (fallback) - but only if popup exists
		const checkInterval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			if (popups.length > 0) {
				ensurePopupVisible()
			}
		}, 500)

		return () => {
			observer.disconnect()
			clearInterval(checkInterval)
			if (quillRef.current) {
				quillRef.current.removeEventListener('click', handleMenuClick, true)
			}
			document.removeEventListener('click', handleMenuClick, true)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
