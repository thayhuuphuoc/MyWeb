'use client'
import useHeadingsData from "@/hooks/use-headings-data";
import {useState} from "react";
import useHeadingIntersectionObserver from "@/hooks/use-heading-intersection-observer";
import './table-of-content.css'
const Headings = ({ headings, activeId }) => (
	<ul className={''}>
		{headings.map((heading) => (
			<li key={heading.id} className={heading.id === activeId ? "active-" : ""}>
				<a
					href={`#${heading.id}`}
					onClick={(e) => {
						e.preventDefault();
						document.querySelector(`#${heading.id}`)?.scrollIntoView({
							behavior: "smooth"
						});
					}}
				>
					{heading.title}
				</a>
				{heading.items.length > 0 && (
					<ul className={''}>
						{heading.items.map((child) => (
							<li key={child.id} className={child.id === activeId ? "active-" : ""}>
								<a
									href={`#${child.id}`}
									onClick={(e) => {
										e.preventDefault();
										document.querySelector(`#${child.id}`)?.scrollIntoView({
											behavior: "smooth"
										});
									}}
								>
									{child.title}
								</a>
							</li>
						))}
					</ul>
				)}
			</li>
		))}
	</ul>
);

// must have #post-body
export default function TableOfContent(){
	const [activeId, setActiveId] = useState();
	const { nestedHeadings } = useHeadingsData();
	useHeadingIntersectionObserver(setActiveId);

	if(nestedHeadings.length === 0) return <></>

	return (
		// <div className={'hidden 2xl:block 2xl:h-full 2xl:w-72 2xl:p-4 2xl:absolute 2xl:right-0 2xl:top-0 2xl:translate-x-full'}>
		<div className={'border-2 border-blue-400 rounded-lg border-dashed p-3 md:p-5 bg-white/30 mb-8'}>
			<nav id={'toc'} className={'prose'} aria-label="Table of contents">
				<p className={'text-base font-bold text-black font-sans not-prose'}>Nội dung chính</p>
				<hr className={'gradient-line not-prose my-3'}/>
				<Headings headings={nestedHeadings} activeId={activeId}/>
			</nav>
		</div>
	)
}












