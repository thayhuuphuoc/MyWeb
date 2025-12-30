"use client"

import React, {useEffect, useRef} from "react";
import '@/styles/quill/quill.css'
import 'quill-table-better/dist/quill-table-better.css'
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

		// Set default border values for table form
		const tableModule = quill.getModule('table-better')
		if (tableModule && tableModule.tableMenus) {
			const tableMenus = tableModule.tableMenus
			
			// Store original tablePropertiesForm
			let _tablePropertiesForm = tableMenus.tablePropertiesForm || null
			
			// Intercept setter to modify attribute and update UI
			Object.defineProperty(tableMenus, 'tablePropertiesForm', {
				set: function(newForm) {
					if (newForm && newForm.options && newForm.options.type === 'table') {
						// Modify attribute to set defaults
						const attrs = newForm.options.attribute || {}
						
						// Set default border-style to 'solid' if not set or is 'none'
						if (!attrs['border-style'] || attrs['border-style'] === '' || attrs['border-style'] === 'none') {
							attrs['border-style'] = 'solid'
						}
						
						// Set default border-color to '#000000' if not set
						if (!attrs['border-color'] || attrs['border-color'] === '') {
							attrs['border-color'] = '#000000'
						}
						
						// Set default border-width to '1px' if not set
						if (!attrs['border-width'] || attrs['border-width'] === '') {
							attrs['border-width'] = '1px'
						}
						
						// Update options.attribute
						newForm.options.attribute = attrs
						
						// Update attrs (form constructor already copied, so we need to update it)
						newForm.attrs = { ...newForm.attrs, ...attrs }
						
						// Use setAttribute method to update UI properly
						const updateFormUI = () => {
							if (!newForm.form || !newForm.form.parentNode) return false
							
							// Use form's setAttribute method to update values
							if (newForm.setAttribute) {
								if (attrs['border-style']) {
									newForm.setAttribute('border-style', attrs['border-style'])
								}
								if (attrs['border-color']) {
									newForm.setAttribute('border-color', attrs['border-color'])
								}
								if (attrs['border-width']) {
									newForm.setAttribute('border-width', attrs['border-width'])
								}
							}
							
							// Also update UI directly as fallback
							const borderRow = newForm.form.querySelector('.properties-form-row')
							if (borderRow) {
								// Update dropdown text
								const dropText = borderRow.querySelector('.ql-table-dropdown-text') as HTMLElement
								if (dropText && attrs['border-style']) {
									dropText.innerText = attrs['border-style']
								}
								
								// Update color
								const colorInput = borderRow.querySelector('.label-field-view-color .property-input') as HTMLInputElement
								const colorButton = borderRow.querySelector('.color-button') as HTMLElement
								if (colorInput && attrs['border-color']) {
									colorInput.value = attrs['border-color']
									if (colorButton) {
										colorButton.style.backgroundColor = attrs['border-color']
										colorButton.classList.remove('color-unselected')
									}
								}
								
								// Update width
								const allInputs = borderRow.querySelectorAll('.property-input')
								if (allInputs.length > 1) {
									const widthInput = allInputs[1] as HTMLInputElement
									if (widthInput && attrs['border-width']) {
										widthInput.value = attrs['border-width']
									}
								}
								
								// Enable inputs
								const colorContainer = borderRow.querySelector('.ql-table-color-container') as HTMLElement
								if (colorContainer) {
									colorContainer.classList.remove('ql-table-disabled')
								}
								const allContainers = borderRow.querySelectorAll('.label-field-view')
								if (allContainers.length > 1) {
									const widthContainer = allContainers[1] as HTMLElement
									if (widthContainer) {
										widthContainer.classList.remove('ql-table-disabled')
									}
								}
							}
							
							return true
						}
						
						// Try to update UI with retries
						if (!updateFormUI()) {
							setTimeout(() => {
								if (!updateFormUI()) {
									setTimeout(updateFormUI, 50)
								}
							}, 10)
						}
					}
					
					_tablePropertiesForm = newForm
				},
				get: function() {
					return _tablePropertiesForm
				},
				configurable: true,
				enumerable: true
			})
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
