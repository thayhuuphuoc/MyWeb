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

		// Function to show popup when found
		const showPopup = () => {
			const popup = document.querySelector('.ql-table-properties-form') as HTMLElement
			if (popup && popup.isConnected) {
				// Remove hidden class
				popup.classList.remove('ql-hidden')
				// Force visibility
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
				popup.style.setProperty('pointer-events', 'auto', 'important')
				return true
			}
			return false
		}

		// Observe document body for popup creation (popup may be added outside quill container)
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					// Convert NodeList to Array for iteration (fix TypeScript error)
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as Element
							// Check if the added node is the popup
							if (element.classList.contains('ql-table-properties-form')) {
								showPopup()
							}
							// Check if popup is nested inside added node
							const nestedPopup = element.querySelector('.ql-table-properties-form')
							if (nestedPopup) {
								showPopup()
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
			if (target.closest('[data-category="table"], [data-category="cell"]')) {
				// Module creates popup asynchronously, check multiple times
				setTimeout(() => {
					if (!showPopup()) {
						// If not found, try again after longer delay
						setTimeout(showPopup, 100)
						setTimeout(showPopup, 200)
						setTimeout(showPopup, 300)
					}
				}, 50)
			}
		}

		// Listen on document to catch clicks anywhere
		document.addEventListener('click', handleClick, true)

		return () => {
			observer.disconnect()
			document.removeEventListener('click', handleClick, true)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
