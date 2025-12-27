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
