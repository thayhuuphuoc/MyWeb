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

		// Simple function to ensure popup is visible - only called when needed
		const showPopup = () => {
			const popup = document.querySelector('.ql-table-properties-form') as HTMLElement
			if (popup && popup.isConnected) {
				popup.classList.remove('ql-hidden')
				popup.style.display = 'block'
				popup.style.visibility = 'visible'
				popup.style.opacity = '1'
				popup.style.pointerEvents = 'auto'
			}
		}

		// Simple observer - only watch for new nodes, not attributes (to avoid infinite loop)
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							const element = node as Element
							if (element.classList.contains('ql-table-properties-form')) {
								// Popup was just added, show it immediately and after delays
								showPopup()
								setTimeout(showPopup, 50)
								setTimeout(showPopup, 150)
							}
							// Also check for nested popups
							const nestedPopup = element.querySelector('.ql-table-properties-form')
							if (nestedPopup) {
								showPopup()
								setTimeout(showPopup, 50)
								setTimeout(showPopup, 150)
							}
						}
					}
				}
			}
		})

		// Only observe childList changes, not attributes (to avoid infinite loop)
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true
			})
		}

		// Also listen for clicks on menu items to trigger popup display
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			if (target.closest('[data-category="table"], [data-category="cell"]')) {
				// Wait for popup to be created, then show it
				setTimeout(showPopup, 100)
				setTimeout(showPopup, 200)
			}
		}

		if (quill.container) {
			quill.container.addEventListener('click', handleClick, true)
		}

		return () => {
			observer.disconnect()
			if (quill.container) {
				quill.container.removeEventListener('click', handleClick, true)
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
