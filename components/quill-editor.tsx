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

		// Hide toolbar when table is selected, show only when cell is selected
		const checkAndToggleToolbar = () => {
			setTimeout(() => {
				const selection = quill.getSelection()
				if (!selection) {
					hideTableToolbar()
					return
				}

				// Get DOM nodes
				const [blot] = quill.getLine(selection.index)
				let node: Node | null = blot?.parent?.domNode || null
				
				// Walk up the DOM to find if we're in a cell or table
				let isInCell = false
				let isInTable = false
				
				while (node && node !== quill.root) {
					if (node.nodeType === 1) { // Element node
						const tagName = (node as Element).tagName
						if (tagName === 'TD' || tagName === 'TH') {
							isInCell = true
							isInTable = true
							break
						} else if (tagName === 'TABLE') {
							isInTable = true
							break
						}
					}
					node = node.parentNode
				}

				if (isInCell) {
					// Cell is selected - show toolbar
					showTableToolbar()
				} else {
					// Table or nothing selected - hide toolbar
					hideTableToolbar()
				}
			}, 50)
		}

		const hideTableToolbar = () => {
			document.querySelectorAll('.ql-table-better-menu, [class*="ql-table-better-menu"], [class*="table-menu"]').forEach((el: any) => {
				if (el && !el.closest('.ql-table-better-properties') && !el.closest('.ql-table-better-cell-properties') && !el.closest('.ql-table-better-table-properties')) {
					el.style.display = 'none'
				}
			})
		}

		const showTableToolbar = () => {
			document.querySelectorAll('.ql-table-better-menu, [class*="ql-table-better-menu"], [class*="table-menu"]').forEach((el: any) => {
				if (el && !el.closest('.ql-table-better-properties') && !el.closest('.ql-table-better-cell-properties') && !el.closest('.ql-table-better-table-properties')) {
					el.style.display = 'flex'
				}
			})
		}

		// Use MutationObserver to watch for menu appearance and selection changes
		const observer = new MutationObserver(() => {
			checkAndToggleToolbar()
		})

		observer.observe(quill.root, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		})

		quill.on('selection-change', checkAndToggleToolbar)
		quill.root.addEventListener('click', checkAndToggleToolbar, true)
		
		// Initial check
		checkAndToggleToolbar()
		
		return () => {
			observer.disconnect()
			quill.off('selection-change', checkAndToggleToolbar)
			quill.root.removeEventListener('click', checkAndToggleToolbar, true)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
