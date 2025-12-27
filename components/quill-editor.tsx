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

		// Ensure popup is visible when created - observe for popup addition
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as HTMLElement
							
							// Check if added node is the popup
							if (element.classList.contains('ql-table-properties-form')) {
								// Remove hidden class immediately
								element.classList.remove('ql-hidden')
								// Force visibility with inline styles
								element.style.display = 'block'
								element.style.visibility = 'visible'
								element.style.opacity = '1'
								
								// Also check after a brief delay to ensure it stays visible
								setTimeout(() => {
									element.classList.remove('ql-hidden')
									element.style.display = 'block'
									element.style.visibility = 'visible'
									element.style.opacity = '1'
								}, 0)
							}
							
							// Check for nested popup
							const nestedPopup = element.querySelector?.('.ql-table-properties-form')
							if (nestedPopup instanceof HTMLElement) {
								nestedPopup.classList.remove('ql-hidden')
								nestedPopup.style.display = 'block'
								nestedPopup.style.visibility = 'visible'
								nestedPopup.style.opacity = '1'
							}
						}
					}
				}
			}
		})

		// Observe quill.container for popup creation
		observer.observe(quill.container, {
			childList: true,
			subtree: true
		})

		return () => {
			observer.disconnect()
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
