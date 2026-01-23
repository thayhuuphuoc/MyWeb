'use client'

import '@/styles/quill/quill.css'
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.min.css'

import CopyButtonPlugin from "highlightjs-copy";
import 'highlightjs-copy/dist/highlightjs-copy.min.css'

import {useEffect, useRef} from "react";
import {TPost} from "@/actions/posts/validations";
import TableOfContent from "@/components/public/shared/table-of-content";

hljs.addPlugin(new CopyButtonPlugin());
import 'quill-better-table/dist/quill-better-table.css'

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default function PostBody({data}: {
	data: TPost
}){
	const ref = useRef<HTMLDivElement>(null)

	useEffect(()=>{
		const promise = new Promise<void>((resolve, reject) => {
			ref.current?.querySelectorAll('pre:not([data-highlighted])').forEach((el, index, array) => {
				if(el instanceof HTMLElement){
					el.innerHTML = `<code class="language-${el.getAttribute('data-language')}">${el.innerHTML}</code>`
					el.dataset.highlighted = 'true'
				}

				if (index === array.length -1) resolve();
			})
		})

		promise.then(() => {
			hljs.highlightAll()

			const blocks = document.querySelectorAll('pre code.hljs');
			Array.prototype.forEach.call(blocks, function(block) {
				const language = block.result.language;
				block.insertAdjacentHTML("afterbegin",`<label style="float: right">${language}</label>`)
			});
		})
	}, [])

	// Force apply word-break styles after content renders
	// This fixes the word-breaking issue caused by Quill's default word-break: break-word
	useEffect(() => {
		if (!ref.current) return;
		
		const applyWordBreakStyles = () => {
			const postBody = ref.current;
			if (!postBody) return;

			// Get all text elements within post-body
			const allElements = postBody.querySelectorAll('*');
			allElements.forEach((el) => {
				if (el instanceof HTMLElement) {
					el.style.setProperty('word-break', 'normal', 'important');
					el.style.setProperty('overflow-wrap', 'break-word', 'important');
					el.style.setProperty('word-wrap', 'break-word', 'important');
					el.style.setProperty('white-space', 'normal', 'important');
					el.style.setProperty('hyphens', 'none', 'important');
				}
			});

			// Also apply to the post-body element itself
			if (postBody instanceof HTMLElement) {
				postBody.style.setProperty('word-break', 'normal', 'important');
				postBody.style.setProperty('overflow-wrap', 'break-word', 'important');
				postBody.style.setProperty('word-wrap', 'break-word', 'important');
			}
		};

		// Apply immediately
		applyWordBreakStyles();

		// Apply after delays to catch dynamically loaded content
		const timeout1 = setTimeout(applyWordBreakStyles, 100);
		const timeout2 = setTimeout(applyWordBreakStyles, 500);
		const timeout3 = setTimeout(applyWordBreakStyles, 1000);

		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
			clearTimeout(timeout3);
		};
	}, [data.body]);

	// Fix: Hide any elements with border that appear before table in rendered posts
	// This fixes the "red streak" issue when content is published
	useEffect(() => {
		if (!ref.current) return;

		const hideElementsBeforeTable = () => {
			const postBody = ref.current;
			if (!postBody) return;

			// Find all tables in the post body
			const tables = postBody.querySelectorAll('table, .ql-table-better');
			
			tables.forEach((table) => {
				if (!(table instanceof HTMLElement)) return;

				// Find the parent container (usually .prose)
				const parent = table.parentElement;
				if (!parent) return;

				// Function to check and hide an element
				const checkAndHideElement = (element: HTMLElement) => {
					// Skip if already hidden
					if (element.style.display === 'none' || element.style.visibility === 'hidden') {
						return;
					}

					// Get computed styles
					const computed = window.getComputedStyle(element);
					const borderWidth = parseFloat(computed.borderWidth) || 0;
					const borderTopWidth = parseFloat(computed.borderTopWidth) || 0;
					const borderBottomWidth = parseFloat(computed.borderBottomWidth) || 0;
					const borderLeftWidth = parseFloat(computed.borderLeftWidth) || 0;
					const borderRightWidth = parseFloat(computed.borderRightWidth) || 0;
					const borderColor = computed.borderColor;
					const borderStyle = computed.borderStyle;
					const borderTopStyle = computed.borderTopStyle;
					const borderBottomStyle = computed.borderBottomStyle;
					const borderLeftStyle = computed.borderLeftStyle;
					const borderRightStyle = computed.borderRightStyle;
					
					// Check if element has any visible border (any side)
					const hasBorder = (borderWidth > 0 || borderTopWidth > 0 || borderBottomWidth > 0 || 
						borderLeftWidth > 0 || borderRightWidth > 0) && 
						(borderStyle !== 'none' && borderStyle !== 'hidden' ||
						borderTopStyle !== 'none' && borderTopStyle !== 'hidden' ||
						borderBottomStyle !== 'none' && borderBottomStyle !== 'hidden' ||
						borderLeftStyle !== 'none' && borderLeftStyle !== 'hidden' ||
						borderRightStyle !== 'none' && borderRightStyle !== 'hidden');
					
					// Check if element is a td or th (orphaned table cell)
					const isOrphanedCell = (element.tagName === 'TD' || element.tagName === 'TH') && 
						!element.closest('table');
					
					// Check if element has red border (common issue)
					const isRedBorder = borderColor.includes('rgb(255, 0, 0)') || 
						borderColor.includes('rgb(255,0,0)') ||
						borderColor.toLowerCase().includes('#ff0000') ||
						borderColor.toLowerCase().includes('#f00') ||
						borderColor.toLowerCase().includes('red');
					
					// Check if element is small (likely orphaned cell)
					const elementWidth = parseFloat(computed.width) || 0;
					const elementHeight = parseFloat(computed.height) || 0;
					const isSmallElement = elementWidth < 50 && elementHeight < 50 && hasBorder;
					
					// Check if element has inline style with border
					const hasInlineBorder = element.style.border || 
						element.style.borderTop || 
						element.style.borderBottom || 
						element.style.borderLeft || 
						element.style.borderRight ||
						element.style.borderColor ||
						element.style.borderWidth ||
						element.style.borderStyle;
					
					// Hide element if it matches any of these conditions
					if (hasBorder && (isOrphanedCell || isRedBorder || isSmallElement || hasInlineBorder)) {
						element.style.setProperty('display', 'none', 'important');
						element.style.setProperty('visibility', 'hidden', 'important');
						element.style.setProperty('border', 'none', 'important');
						element.style.setProperty('border-top', 'none', 'important');
						element.style.setProperty('border-bottom', 'none', 'important');
						element.style.setProperty('border-left', 'none', 'important');
						element.style.setProperty('border-right', 'none', 'important');
						element.style.setProperty('height', '0', 'important');
						element.style.setProperty('width', '0', 'important');
						element.style.setProperty('margin', '0', 'important');
						element.style.setProperty('padding', '0', 'important');
						element.style.setProperty('opacity', '0', 'important');
						element.style.setProperty('position', 'absolute', 'important');
						element.style.setProperty('left', '-9999px', 'important');
						element.style.setProperty('top', '-9999px', 'important');
						element.style.setProperty('pointer-events', 'none', 'important');
					}
				};

				// Check all direct children of parent before this table
				let currentElement: Element | null = table.previousElementSibling;
				
				while (currentElement) {
					if (currentElement instanceof HTMLElement) {
						checkAndHideElement(currentElement);
					}
					// Move to previous sibling
					currentElement = currentElement.previousElementSibling;
				}

				// Also check all elements in parent that come before table in DOM order
				// This catches elements that might not be direct siblings
				const allChildren = Array.from(parent.children);
				const tableIndex = allChildren.indexOf(table);
				
				if (tableIndex > 0) {
					for (let i = 0; i < tableIndex; i++) {
						const child = allChildren[i];
						if (child instanceof HTMLElement) {
							checkAndHideElement(child);
						}
					}
				}

				// Also check for any orphaned td/th elements in the entire post body
				const orphanedCells = postBody.querySelectorAll('td:not(table td), th:not(table th)');
				orphanedCells.forEach((cell) => {
					if (cell instanceof HTMLElement) {
						checkAndHideElement(cell);
					}
				});
			});
		};

		// Apply immediately and after delays to catch dynamically loaded content
		hideElementsBeforeTable();
		const timeout1 = setTimeout(hideElementsBeforeTable, 100);
		const timeout2 = setTimeout(hideElementsBeforeTable, 500);
		const timeout3 = setTimeout(hideElementsBeforeTable, 1000);
		const timeout4 = setTimeout(hideElementsBeforeTable, 2000);

		// Use MutationObserver to watch for DOM changes
		const observer = new MutationObserver(() => {
			hideElementsBeforeTable();
		});

		// Start observing
		if (ref.current) {
			observer.observe(ref.current, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['style', 'class']
			});
		}

		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
			clearTimeout(timeout3);
			clearTimeout(timeout4);
			observer.disconnect();
		};
	}, [data.body]);

	// lightbox
	useEffect(() => {
		const images = document.querySelectorAll('#post-body img')
		images.forEach(img => {
			const linkWrapper = document.createElement('a')
			linkWrapper.href = img.getAttribute('src') || ''
			linkWrapper.target = '_blank'
			linkWrapper.className = 'pswp-img'

			const image = new Image();
			image.onload = function() {
				// alert(this.width + 'x' + this.height);
				// @ts-ignore
				linkWrapper.setAttribute('data-pswp-width', img.naturalWidth)
				// @ts-ignore
				linkWrapper.setAttribute('data-pswp-height', img.naturalHeight)
			}
			image.src = img.getAttribute('src') || ''

			img.parentNode?.insertBefore(linkWrapper, img)
			linkWrapper.appendChild(img)
		})

		let lightbox: any = new PhotoSwipeLightbox({
			gallery: '#post-body a.pswp-img',
			pswpModule: () => import('photoswipe'),
		});

		setTimeout(() => {
			lightbox.init();
		}, 200)

		return () => {
			lightbox.destroy();
			lightbox = null;
		};
	}, [])

	return (
		<div
			ref={ref}
			id={'post-body'}
			className={'font-serif'}
		>
			<TableOfContent/>

			<div
				className={'prose md:prose-lg prose-li:marker:text-gray-500 break-words ql-snow max-w-none'}
				dangerouslySetInnerHTML={{ __html: String(data.body).replace(/&nbsp;|\u00A0/g, ' ') }}
			/>
		</div>
	)
}
