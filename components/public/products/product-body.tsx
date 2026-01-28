'use client'

import '@/styles/quill/quill.css'
import {TProduct} from "@/actions/products/validations";
import {useEffect, useRef} from "react";

export default function ProductBody({data}: {
	data: TProduct
}){
	const ref = useRef<HTMLDivElement>(null)

	// Force apply word-break styles after content renders
	// This fixes the word-breaking issue caused by Quill's default word-break: break-word
	useEffect(() => {
		if (!ref.current) return;
		
		const applyWordBreakStyles = () => {
			const productBody = ref.current;
			if (!productBody) return;

			// Get all text elements within product-body
			const allElements = productBody.querySelectorAll('*');
			allElements.forEach((el) => {
				if (el instanceof HTMLElement) {
					el.style.setProperty('word-break', 'normal', 'important');
					el.style.setProperty('overflow-wrap', 'break-word', 'important');
					el.style.setProperty('word-wrap', 'break-word', 'important');
					el.style.setProperty('white-space', 'normal', 'important');
					el.style.setProperty('hyphens', 'none', 'important');
				}
			});

			// Also apply to the product-body element itself
			if (productBody instanceof HTMLElement) {
				productBody.style.setProperty('word-break', 'normal', 'important');
				productBody.style.setProperty('overflow-wrap', 'break-word', 'important');
				productBody.style.setProperty('word-wrap', 'break-word', 'important');
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

	return (
		<div
			ref={ref}
			className={'prose max-w-none w-full font-serif break-words ql-snow'}
		>
			<div
				dangerouslySetInnerHTML={{__html: String(data.body).replace(/&nbsp;|\u00A0/g, ' ')}}
			/>
		</div>
	)
}
