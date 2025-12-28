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

		// Function to ensure popup is visible
		const ensurePopupVisible = (popup: HTMLElement) => {
			try {
				if (!popup || !popup.isConnected) return
				
				// Remove ql-hidden class
				popup.classList.remove('ql-hidden')
				
				// Ensure visibility styles
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
				popup.style.setProperty('pointer-events', 'auto', 'important')
			} catch (error) {
				// Silently fail
			}
		}

		// MutationObserver to catch popup creation and visibility changes
		const observer = new MutationObserver((mutations) => {
			try {
				for (const mutation of mutations) {
					// Check for added nodes
					if (mutation.addedNodes.length) {
						for (const node of Array.from(mutation.addedNodes)) {
							if (node.nodeType === Node.ELEMENT_NODE) {
								const element = node as Element
								
								// Check if the added node is the popup itself
								if (element.classList?.contains('ql-table-properties-form')) {
									ensurePopupVisible(element as HTMLElement)
								}
								
								// Check if popup is nested inside added node
								const nestedPopup = element.querySelector?.('.ql-table-properties-form')
								if (nestedPopup instanceof HTMLElement) {
									ensurePopupVisible(nestedPopup)
								}
							}
						}
					}
					
					// Watch for class changes that might hide the popup
					if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
						const target = mutation.target as Element
						if (target.classList?.contains('ql-table-properties-form')) {
							if (target.classList.contains('ql-hidden')) {
								ensurePopupVisible(target as HTMLElement)
							}
						}
					}
				}
			} catch (error) {
				// Silently fail
			}
		})

		// Observe document body and quill container for popup creation
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		})

		observer.observe(quill.container, {
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
