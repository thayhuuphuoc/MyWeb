import {useEffect, useRef} from "react";

const useHeadingIntersectionObserver = (setActiveId) => {
	const headingElementsRef = useRef({});
	useEffect(() => {
		const callback = (headings) => {
			headingElementsRef.current = headings.reduce((map, headingElement) => {
				map[headingElement.target.id] = headingElement;
				return map;
			}, headingElementsRef.current);

			const visibleHeadings: any[] = [];
			Object.keys(headingElementsRef.current).forEach((key) => {
				const headingElement = headingElementsRef.current[key];
				if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
			});

			const headingElements = Array.from(document.querySelectorAll("#post-body h2, #post-body h3"));
			const getIndexFromId = (id) =>
				headingElements.findIndex((heading) => heading.id === id);

			if (visibleHeadings.length === 1) {
				setActiveId(visibleHeadings[0].target.id);
			} else if (visibleHeadings.length > 1) {
				const sortedVisibleHeadings = visibleHeadings.sort(
					// @ts-ignore
					(a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
				);
				setActiveId(sortedVisibleHeadings[0].target.id);
			}
		};

		const observer = new IntersectionObserver(callback, {
			rootMargin: "0px 0px -40% 0px"
		});

		const headingElements = Array.from(document.querySelectorAll("#post-body h2, #post-body h3"));

		headingElements.forEach((element) => observer.observe(element));

		// Thử lại sau một khoảng thời gian để đảm bảo content đã render
		const timeout1 = setTimeout(() => {
			const newHeadings = Array.from(document.querySelectorAll("#post-body h2, #post-body h3"));
			newHeadings.forEach((element) => {
				if (!Array.from(headingElements).includes(element)) {
					observer.observe(element);
				}
			});
		}, 500);

		const timeout2 = setTimeout(() => {
			const newHeadings = Array.from(document.querySelectorAll("#post-body h2, #post-body h3"));
			newHeadings.forEach((element) => {
				if (!Array.from(headingElements).includes(element)) {
					observer.observe(element);
				}
			});
		}, 1000);

		return () => {
			observer.disconnect();
			clearTimeout(timeout1);
			clearTimeout(timeout2);
		};
	}, [setActiveId]);
};
export default useHeadingIntersectionObserver