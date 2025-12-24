import {ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE} from "@/enum/enums";

import Quill from "quill"
import {uploadFile} from "@/lib/image-data";
import hljs from "highlight.js";
import {ImageResize} from "quill-image-resize-module-ts";
import QuillBetterTable from 'quill-better-table'

let icons: any = Quill.import('ui/icons');
icons['custom-code'] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-code-2"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m5 12-3 3 3 3"/><path d="m9 18 3-3-3-3"/></svg>';
icons['image-url'] = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
icons['table'] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
hljs.configure({
	languages: ['html', 'css', 'javascript', 'php', 'python', 'typescript'],
})

Quill.register({'modules/better-table': QuillBetterTable}, true)
Quill.register('modules/imageResize', ImageResize);

export const QuillConfig = {
	syntax: {hljs},
	toolbar: {
		container: [
			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],
			['link', 'image', 'image-url', 'video', 'formula'],
			['table'],                                         // insert table button

			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
			[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
			[{ 'direction': 'rtl' }],                         // text direction

			[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
			[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
			[{ 'font': [] }],
			[{ 'align': [] }],

			['clean', 'custom-code']                                         // remove formatting button
		],
		handlers: {
			'custom-code': function(this: any) {
				const editorInstance = this.quill
				if (!editorInstance) return

				const tool = document.querySelector('.ql-custom-code')
				const isActive = tool?.classList.contains('active')

				if(isActive){
					tool?.classList.remove('active')
					const data = editorInstance.getText()
					const delta = editorInstance.clipboard.convert({html: data})

					editorInstance.setContents(delta, 'silent')

					return
				}

				tool?.classList.add('active')
				const data = editorInstance.root.innerHTML
				editorInstance.setText(data)

				return
			},
			'image': function(this: any){
				const editorInstance = this.quill
				if (!editorInstance) return

				const qlImage = document.querySelector('.ql-image')
				if(!qlImage) return

				const qlImageInput: HTMLInputElement | null = document.querySelector('.ql-image-input')
				const loadingImage = 'https://i.giphy.com/3oEjI6SIIHBdRxXI40.webp'

				if(!qlImageInput){
					const inputElement = document.createElement('input');
					inputElement.type = 'file';
					inputElement.accept = ACCEPTED_IMAGE_TYPES.join(',')
					inputElement.classList.add('ql-image-input')

					inputElement.addEventListener('change', async (event) => {
						// @ts-ignore
						const image = event?.target?.files[0]

						if(image.size > MAX_FILE_SIZE) {
							alert("File is too big!");
							return
						}

						const range = editorInstance.getSelection();

						// loading
						editorInstance.insertEmbed(range.index, 'image', loadingImage);

						// upload image
						const resImage = await uploadFile(image)
						const data = await resImage?.json();

						editorInstance.deleteText(range.index, 1)
						editorInstance.insertEmbed(range.index, 'image', `${data.secure_url}`);
					});

					inputElement.click()
				} else {
					qlImageInput.click()
				}
			},
			'image-url': function(this:any){
				const editorInstance = this.quill
				if (!editorInstance) return

				const range = editorInstance.getSelection();
				const value = prompt('enter image url here.');
				if(value){
					editorInstance.insertEmbed(range.index, 'image', value, Quill.sources.USER);
				}
			},
			'table': function(this: any) {
				const editorInstance = this.quill
				if (!editorInstance) return

				// Lấy module better-table
				const tableModule = editorInstance.getModule('better-table')
				if (!tableModule) {
					console.error('Better-table module not found')
					return
				}

				// Hiển thị dialog để chọn kích thước bảng
				const rows = prompt('Nhập số hàng (rows):', '3')
				if (!rows) return

				const cols = prompt('Nhập số cột (columns):', '3')
				if (!cols) return

				const rowCount = parseInt(rows, 10)
				const colCount = parseInt(cols, 10)

				if (isNaN(rowCount) || isNaN(colCount)) {
					alert('Vui lòng nhập số hợp lệ')
					return
				}

				if (rowCount > 0 && rowCount <= 20 && colCount > 0 && colCount <= 20) {
					// Chèn bảng với kích thước đã chọn
					// QuillBetterTable sử dụng method insertTable
					try {
						if (typeof tableModule.insertTable === 'function') {
							tableModule.insertTable(rowCount, colCount)
						} else if (typeof tableModule.insertTableByRowCol === 'function') {
							tableModule.insertTableByRowCol(rowCount, colCount)
						} else {
							// Fallback: tạo bảng HTML và insert vào editor
							let tableHTML = '<table><tbody>'
							for (let i = 0; i < rowCount; i++) {
								tableHTML += '<tr>'
								for (let j = 0; j < colCount; j++) {
									tableHTML += '<td><p><br></p></td>'
								}
								tableHTML += '</tr>'
							}
							tableHTML += '</tbody></table>'

							const range = editorInstance.getSelection(true)
							if (range) {
								const delta = editorInstance.clipboard.convert({ html: tableHTML })
								editorInstance.updateContents(
									new editorInstance.constructor.import('delta')().retain(range.index).concat(delta),
									Quill.sources.USER
								)
							}
						}
					} catch (error) {
						console.error('Error inserting table:', error)
						alert('Có lỗi xảy ra khi chèn bảng. Vui lòng thử lại.')
					}
				} else {
					alert('Số hàng và cột phải từ 1 đến 20')
				}
			}
		}
	},
	clipboard: {
		matchVisual: false
	},
	table: false,  // disable table module
	'better-table': {
		operationMenu: {
			items: {
				unmergeCells: {
					text: 'Another unmerge cells name'
				}
			}
		}
	},
	keyboard: {
		bindings: QuillBetterTable.keyboardBindings
	},
	imageResize: {
		modules: [ 'Resize', 'DisplaySize' ]
	}
}

