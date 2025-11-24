import {useEffect, useState} from "react";

const getNestedHeadings = (headingElements) => {
	const nestedHeadings: {
		id: string,
		title: string,
		items: {
			id: string,
			title: string,
		}[]
	}[] = [];

	headingElements.forEach((heading, index) => {
		const { innerText: title, id } = heading;

		if (heading.nodeName === "H2") {
			nestedHeadings.push({ id, title, items: [] });
		} else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
			nestedHeadings[nestedHeadings.length - 1].items.push({
				id,
				title,
			});
		}
	});

	return nestedHeadings;
};

const useHeadingsData = () => {
	const [nestedHeadings, setNestedHeadings] = useState<any[]>([]);

	useEffect(() => {
		const headingElements = Array.from(
			document.getElementById('post-body')!.querySelectorAll("h2, h3")
		);
		headingElements.forEach((heading,index) => {
			heading.id = `${heading.tagName}_${index}`
		})

		const newNestedHeadings = getNestedHeadings(headingElements);
		setNestedHeadings(newNestedHeadings);
	}, []);

	return { nestedHeadings };
};

export default useHeadingsData
