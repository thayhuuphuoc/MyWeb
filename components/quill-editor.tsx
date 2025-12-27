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

		// Function to ensure popup is visible - called immediately when popup is detected
		const ensurePopupVisible = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove hidden class
			popup.classList.remove('ql-hidden')
			
			// Force visibility with highest priority inline styles
			popup.style.setProperty('display', 'block', 'important')
			popup.style.setProperty('visibility', 'visible', 'important')
			popup.style.setProperty('opacity', '1', 'important')
			popup.style.setProperty('pointer-events', 'auto', 'important')
			popup.style.setProperty('position', 'absolute', 'important')
			popup.style.setProperty('z-index', '10001', 'important')
			
			// Also ensure container allows it to be visible (no overflow hidden)
			const container = popup.parentElement
			if (container) {
				const computedStyle = window.getComputedStyle(container)
				if (computedStyle.overflow === 'hidden') {
					container.style.setProperty('overflow', 'visible', 'important')
				}
			}
		}

		// MutationObserver to detect popup creation
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as HTMLElement
							
							// Check if added node is the popup
							if (element.classList && element.classList.contains('ql-table-properties-form')) {
								// Immediately ensure visibility
								ensurePopupVisible(element)
								
								// Multiple checks to catch it at different lifecycle stages
								requestAnimationFrame(() => ensurePopupVisible(element))
								setTimeout(() => ensurePopupVisible(element), 0)
								setTimeout(() => ensurePopupVisible(element), 50)
								setTimeout(() => ensurePopupVisible(element), 100)
								setTimeout(() => ensurePopupVisible(element), 200)
							}
							
							// Check for nested popup
							if (element.querySelector) {
								const nestedPopup = element.querySelector('.ql-table-properties-form')
								if (nestedPopup instanceof HTMLElement) {
									ensurePopupVisible(nestedPopup)
									requestAnimationFrame(() => ensurePopupVisible(nestedPopup))
									setTimeout(() => ensurePopupVisible(nestedPopup), 0)
									setTimeout(() => ensurePopupVisible(nestedPopup), 50)
								}
							}
						}
					}
				}
			}
		})

		// Observe quill.container (where popup is appended per module source)
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true
			})
		}

		// Periodic check to maintain visibility
		const checkInterval = setInterval(() => {
			const popups = quill.container.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					ensurePopupVisible(popup)
				}
			})
		}, 250)

		return () => {
			observer.disconnect()
			clearInterval(checkInterval)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
