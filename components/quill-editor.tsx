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

		// Hook into appendChild to intercept when popup is added
		const originalAppendChild = quill.container.appendChild.bind(quill.container)
		quill.container.appendChild = function<T extends Node>(child: T): T {
			const result = originalAppendChild(child) as T
			
			// Check if appended child is the popup
			if (child instanceof HTMLElement && child.classList.contains('ql-table-properties-form')) {
				// Immediately ensure visibility
				child.classList.remove('ql-hidden')
				child.style.setProperty('display', 'block', 'important')
				child.style.setProperty('visibility', 'visible', 'important')
				child.style.setProperty('opacity', '1', 'important')
				child.style.setProperty('position', 'absolute', 'important')
				child.style.setProperty('z-index', '10001', 'important')
				
				// Continue checking after module's positioning logic
				requestAnimationFrame(() => {
					child.classList.remove('ql-hidden')
					child.style.setProperty('display', 'block', 'important')
					child.style.setProperty('visibility', 'visible', 'important')
					child.style.setProperty('opacity', '1', 'important')
				})
				
				setTimeout(() => {
					child.classList.remove('ql-hidden')
					child.style.setProperty('display', 'block', 'important')
					child.style.setProperty('visibility', 'visible', 'important')
					child.style.setProperty('opacity', '1', 'important')
				}, 0)
				
				setTimeout(() => {
					child.classList.remove('ql-hidden')
					child.style.setProperty('display', 'block', 'important')
					child.style.setProperty('visibility', 'visible', 'important')
					child.style.setProperty('opacity', '1', 'important')
				}, 50)
			}
			
			return result
		}

		// MutationObserver as backup
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1) {
							const element = node as HTMLElement
							
							if (element.classList.contains('ql-table-properties-form')) {
								element.classList.remove('ql-hidden')
								element.style.setProperty('display', 'block', 'important')
								element.style.setProperty('visibility', 'visible', 'important')
								element.style.setProperty('opacity', '1', 'important')
								element.style.setProperty('position', 'absolute', 'important')
								element.style.setProperty('z-index', '10001', 'important')
							}
							
							const nestedPopup = element.querySelector?.('.ql-table-properties-form')
							if (nestedPopup instanceof HTMLElement) {
								nestedPopup.classList.remove('ql-hidden')
								nestedPopup.style.setProperty('display', 'block', 'important')
								nestedPopup.style.setProperty('visibility', 'visible', 'important')
								nestedPopup.style.setProperty('opacity', '1', 'important')
							}
						}
					}
				}
			}
		})

		observer.observe(quill.container, {
			childList: true,
			subtree: true
		})

		// Periodic check to ensure popup stays visible
		const ensurePopupVisible = () => {
			const popups = quill.container.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					popup.classList.remove('ql-hidden')
					popup.style.setProperty('display', 'block', 'important')
					popup.style.setProperty('visibility', 'visible', 'important')
					popup.style.setProperty('opacity', '1', 'important')
					popup.style.setProperty('position', 'absolute', 'important')
					popup.style.setProperty('z-index', '10001', 'important')
				}
			})
		}

		const checkInterval = setInterval(ensurePopupVisible, 100)

		return () => {
			observer.disconnect()
			clearInterval(checkInterval)
			quill.container.appendChild = originalAppendChild
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
