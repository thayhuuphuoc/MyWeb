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

		// Simple function to ensure popup is visible - following CodeSandbox approach
		const ensurePopupVisible = (popup: HTMLElement) => {
			try {
				if (!popup || !popup.isConnected) return
				
				// Remove hidden class
				popup.classList.remove('ql-hidden')
				
				// Force visibility - let CSS handle the rest
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
				popup.style.setProperty('overflow', 'visible', 'important')
				popup.style.setProperty('overflow-y', 'auto', 'important')
				popup.style.setProperty('max-height', '90vh', 'important')
				popup.style.setProperty('max-width', '90vw', 'important')
				
				// Ensure popup is not clipped by parent containers
				const parent = popup.parentElement
				if (parent) {
					// Check if parent has overflow hidden
					const parentStyle = window.getComputedStyle(parent)
					if (parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden') {
						// Try to move popup to body if it's being clipped
						if (parent !== document.body) {
							const rect = popup.getBoundingClientRect()
							document.body.appendChild(popup)
							// Restore position
							popup.style.setProperty('position', 'fixed', 'important')
							popup.style.setProperty('top', `${rect.top}px`, 'important')
							popup.style.setProperty('left', `${rect.left}px`, 'important')
						}
					}
				}
			} catch (error) {
				// Silently fail
			}
		}

		// Simple MutationObserver to watch for popup creation
		const observer = new MutationObserver((mutations) => {
			try {
				for (const mutation of mutations) {
					// Watch for added nodes
					if (mutation.addedNodes.length) {
						for (const node of Array.from(mutation.addedNodes)) {
							if (node.nodeType === Node.ELEMENT_NODE) {
								const element = node as HTMLElement
								
								// Check if it's a popup
								if (element.classList?.contains('ql-table-properties-form') ||
								    element.classList?.contains('ql-table-better-properties')) {
									// Use requestAnimationFrame to ensure DOM is ready
									requestAnimationFrame(() => {
										ensurePopupVisible(element)
									})
								}
								
								// Check nested popups
								const popup = element.querySelector?.('.ql-table-properties-form, .ql-table-better-properties')
								if (popup instanceof HTMLElement) {
									requestAnimationFrame(() => {
										ensurePopupVisible(popup)
									})
								}
							}
						}
					}
					
					// Watch for class changes
					if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
						const target = mutation.target as HTMLElement
						if (target.classList?.contains('ql-table-properties-form') ||
						    target.classList?.contains('ql-table-better-properties')) {
							if (target.classList.contains('ql-hidden')) {
								requestAnimationFrame(() => {
									ensurePopupVisible(target)
								})
							}
						}
					}
				}
			} catch (error) {
				// Silently fail
			}
		})

		// Observe document body for popup creation
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		})

		return () => {
			try {
				observer.disconnect()
			} catch (error) {
				// Silently fail
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
