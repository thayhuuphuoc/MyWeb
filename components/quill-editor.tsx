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

		// Function to ensure popup is visible - based on quill-table-better source code
		const ensurePopupVisible = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove hidden class if present
			popup.classList.remove('ql-hidden')
			
			// Ensure visibility - the module uses position: absolute, so we need to respect that
			// but ensure it's visible
			const computed = window.getComputedStyle(popup)
			
			// Only override if it's actually hidden
			if (computed.display === 'none' || 
			    computed.visibility === 'hidden' || 
			    computed.opacity === '0') {
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
			}
			
			// Ensure z-index is high enough
			const zIndex = parseInt(computed.zIndex) || 0
			if (zIndex < 1000) {
				popup.style.setProperty('z-index', '10001', 'important')
			}
			
			// If popup is inside a container with overflow hidden, move it to body
			let parent = popup.parentElement
			while (parent && parent !== document.body) {
				const parentComputed = window.getComputedStyle(parent)
				if (parentComputed.overflow === 'hidden' || 
				    parentComputed.overflowY === 'hidden' ||
				    parentComputed.overflowX === 'hidden') {
					// Get current position
					const rect = popup.getBoundingClientRect()
					// Move to body
					document.body.appendChild(popup)
					// Set position fixed to maintain position
					popup.style.setProperty('position', 'fixed', 'important')
					popup.style.setProperty('top', `${rect.top}px`, 'important')
					popup.style.setProperty('left', `${rect.left}px`, 'important')
					break
				}
				parent = parent.parentElement
			}
		}

		// Watch for popup creation - the module appends form to quill.container
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Check added nodes
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as HTMLElement
							
							// Check if it's the properties form
							if (element.classList?.contains('ql-table-properties-form')) {
								// Use requestAnimationFrame to ensure DOM is ready
								requestAnimationFrame(() => {
									ensurePopupVisible(element)
								})
							}
							
							// Check nested
							const popup = element.querySelector?.('.ql-table-properties-form')
							if (popup instanceof HTMLElement) {
								requestAnimationFrame(() => {
									ensurePopupVisible(popup)
								})
							}
						}
					}
				}
				
				// Check attribute changes (class/style changes)
				if (mutation.type === 'attributes') {
					const target = mutation.target as HTMLElement
					if (target.classList?.contains('ql-table-properties-form')) {
						// If hidden class was added, remove it
						if (target.classList.contains('ql-hidden')) {
							requestAnimationFrame(() => {
								ensurePopupVisible(target)
							})
						}
						// Check if display/visibility changed
						const computed = window.getComputedStyle(target)
						if (computed.display === 'none' || 
						    computed.visibility === 'hidden' || 
						    computed.opacity === '0') {
							requestAnimationFrame(() => {
								ensurePopupVisible(target)
							})
						}
					}
				}
			}
		})

		// Observe quill container (where form is appended)
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class', 'style']
			})
		}

		// Also observe document body in case form is moved
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Periodic check as backup
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						ensurePopupVisible(popup)
					}
				}
			})
		}, 100)

		return () => {
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
