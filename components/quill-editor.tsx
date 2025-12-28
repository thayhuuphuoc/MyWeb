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

		// Function to show popup - comprehensive approach
		const showPopup = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove hidden class
			popup.classList.remove('ql-hidden')
			
			// Force display
			popup.style.cssText = `
				display: block !important;
				visibility: visible !important;
				opacity: 1 !important;
				position: fixed !important;
				z-index: 10001 !important;
				pointer-events: auto !important;
			`
			
			// Move to body if not already there
			if (popup.parentElement !== document.body) {
				const rect = popup.getBoundingClientRect()
				document.body.appendChild(popup)
				popup.style.top = `${rect.top}px`
				popup.style.left = `${rect.left}px`
			}
		}

		// Watch for popup creation with MutationObserver
		const observer = new MutationObserver(() => {
			// Find all popups in document
			const popups = document.querySelectorAll('.ql-table-properties-form, .ql-table-better-properties')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						showPopup(popup)
					}
				}
			})
		})

		// Observe entire document
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Also observe quill container
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class', 'style']
			})
		}

		// Periodic check as backup
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form, .ql-table-better-properties')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						showPopup(popup)
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
