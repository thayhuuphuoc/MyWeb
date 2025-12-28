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
		
		// Ensure we're in browser environment
		if (typeof window === 'undefined' || typeof document === 'undefined') return

		const quill = new Quill(quillRef.current, {
			theme: 'snow',
			modules: QuillConfig
		})

		quill.setContents(quill.clipboard.convert({html: props.value || props.defaultValue}), 'silent')

		quill.on('editor-change', () => props.onChange(quill.getSemanticHTML()))

		// Get table module
		const tableModule = quill.getModule('table-better')
		if (!tableModule) return

		// Function to force show popup - comprehensive approach
		const forceShowPopup = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove hidden class
			popup.classList.remove('ql-hidden')
			
			// Get current style and preserve position
			const rect = popup.getBoundingClientRect()
			const currentTop = popup.style.top || ''
			const currentLeft = popup.style.left || ''
			const currentPosition = popup.style.position || ''
			
			// Force visibility - use setProperty for each style
			popup.style.setProperty('display', 'block', 'important')
			popup.style.setProperty('visibility', 'visible', 'important')
			popup.style.setProperty('opacity', '1', 'important')
			popup.style.setProperty('z-index', '10001', 'important')
			popup.style.setProperty('pointer-events', 'auto', 'important')
			
			// Preserve position if it was set, otherwise use absolute
			if (currentPosition) {
				popup.style.setProperty('position', currentPosition, 'important')
			} else {
				popup.style.setProperty('position', 'absolute', 'important')
			}
			
			if (currentTop) popup.style.setProperty('top', currentTop, 'important')
			if (currentLeft) popup.style.setProperty('left', currentLeft, 'important')
			
			// If popup has no position or is off-screen, ensure it's visible
			if (!currentTop && !currentLeft && (rect.width === 0 || rect.height === 0)) {
				// Position in center of viewport
				const viewportWidth = window.innerWidth
				const viewportHeight = window.innerHeight
				popup.style.setProperty('position', 'fixed', 'important')
				popup.style.setProperty('top', `${(viewportHeight - 400) / 2}px`, 'important')
				popup.style.setProperty('left', `${(viewportWidth - 340) / 2}px`, 'important')
			}
		}

		// Override appendChild to intercept when form is added
		const originalAppendChild = quill.container.appendChild.bind(quill.container)
		quill.container.appendChild = function<T extends Node>(child: T): T {
			const result = originalAppendChild(child) as T
			
			// Check if it's the properties form
			if (child instanceof HTMLElement && child.classList.contains('ql-table-properties-form')) {
				// Force show immediately and multiple times
				forceShowPopup(child)
				requestAnimationFrame(() => {
					forceShowPopup(child)
					setTimeout(() => forceShowPopup(child), 0)
					setTimeout(() => forceShowPopup(child), 10)
					setTimeout(() => forceShowPopup(child), 50)
					setTimeout(() => forceShowPopup(child), 100)
					setTimeout(() => forceShowPopup(child), 200)
				})
			}
			
			return result
		}

		// Also intercept removeChild to prevent form from being removed
		const originalRemoveChild = quill.container.removeChild.bind(quill.container)
		quill.container.removeChild = function<T extends Node>(child: T): T {
			// If trying to remove properties form, don't allow it
			if (child instanceof HTMLElement && child.classList.contains('ql-table-properties-form')) {
				// Just hide it instead of removing
				forceShowPopup(child)
				return child as T
			}
			return originalRemoveChild(child) as T
		}

		// MutationObserver to catch any changes
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Check added nodes
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node instanceof HTMLElement) {
							if (node.classList.contains('ql-table-properties-form')) {
								requestAnimationFrame(() => {
									forceShowPopup(node)
									setTimeout(() => forceShowPopup(node), 0)
									setTimeout(() => forceShowPopup(node), 50)
								})
							}
							
							// Check nested
							const popup = node.querySelector('.ql-table-properties-form')
							if (popup instanceof HTMLElement) {
								requestAnimationFrame(() => {
									forceShowPopup(popup)
								})
							}
						}
					}
				}
				
				// Check attribute changes
				if (mutation.type === 'attributes') {
					const target = mutation.target as HTMLElement
					if (target.classList.contains('ql-table-properties-form')) {
						if (target.classList.contains('ql-hidden') ||
						    target.style.display === 'none' ||
						    target.style.visibility === 'hidden' ||
						    target.style.opacity === '0') {
							requestAnimationFrame(() => {
								forceShowPopup(target)
							})
						}
					}
				}
				
				// Check for removed nodes - prevent removal
				if (mutation.removedNodes.length) {
					for (const node of Array.from(mutation.removedNodes)) {
						if (node instanceof HTMLElement && node.classList.contains('ql-table-properties-form')) {
							// Re-add it if it was removed
							if (!node.isConnected) {
								quill.container.appendChild(node)
								forceShowPopup(node)
							}
						}
					}
				}
			}
		})

		// Observe quill container
		observer.observe(quill.container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Observe document body
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Periodic check - more frequent
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						forceShowPopup(popup)
					}
				}
			})
		}, 30)

		return () => {
			// Restore original methods
			if (quill.container.appendChild !== originalAppendChild) {
				quill.container.appendChild = originalAppendChild
			}
			if (quill.container.removeChild !== originalRemoveChild) {
				quill.container.removeChild = originalRemoveChild
			}
			observer.disconnect()
			clearInterval(interval)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
