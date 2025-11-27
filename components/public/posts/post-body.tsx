'use client'

import '@/styles/quill/quill.css'
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark-dimmed.min.css'

import CopyButtonPlugin from "highlightjs-copy";
import 'highlightjs-copy/dist/highlightjs-copy.min.css'

import {useEffect, useRef} from "react";
import {TPost} from "@/actions/posts/validations";
import TableOfContent from "@/app/(public)/_components/table-of-content";

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
			>
				<div
					dangerouslySetInnerHTML={{__html: String(data.body)}}
				/>
			</div>
		</div>
	)
}
