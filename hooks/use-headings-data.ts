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
		// Lấy text từ nhiều nguồn để đảm bảo có giá trị
		const title = heading.innerText || heading.textContent || heading.textContent?.trim() || '';
		const id = heading.id || '';
		const nodeName = heading.nodeName?.toUpperCase() || '';

		// Bỏ qua nếu không có title hoặc id
		if (!title || !id) {
			return;
		}

		if (nodeName === "H2") {
			nestedHeadings.push({ id, title, items: [] });
		} else if (nodeName === "H3") {
			// Nếu không có H2 nào trước đó, tạo một H2 giả để chứa H3
			if (nestedHeadings.length === 0) {
				nestedHeadings.push({ 
					id: `h2_auto_${index}`, 
					title: 'Nội dung', 
					items: [] 
				});
			}
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
		const updateHeadings = () => {
			const postBody = document.getElementById('post-body');
			if (!postBody) {
				return;
			}

			// Tìm headings trong toàn bộ post-body, bao gồm cả các div con
			const headingElements = Array.from(
				postBody.querySelectorAll("h2, h3, .prose h2, .prose h3, .ql-snow h2, .ql-snow h3, [class*='prose'] h2, [class*='prose'] h3")
			) as HTMLElement[];
			
			// Loại bỏ duplicate headings (có thể do nhiều selector trùng lặp)
			const uniqueHeadings = Array.from(
				new Map(headingElements.map(h => [h, h])).values()
			);
			
			uniqueHeadings.forEach((heading, index) => {
				if (!heading.id) {
					heading.id = `${heading.tagName.toLowerCase()}_${index}`
				}
			})

			const newNestedHeadings = getNestedHeadings(uniqueHeadings);
			setNestedHeadings(newNestedHeadings);
		};

		// Thử tìm headings ngay lập tức
		updateHeadings();

		// Sử dụng MutationObserver để theo dõi thay đổi trong DOM
		const postBody = document.getElementById('post-body');
		if (postBody) {
			const observer = new MutationObserver(() => {
				updateHeadings();
			});

			observer.observe(postBody, {
				childList: true,
				subtree: true,
			});

			// Thử lại sau một khoảng thời gian để đảm bảo content đã render
			const timeout1 = setTimeout(updateHeadings, 100);
			const timeout2 = setTimeout(updateHeadings, 500);
			const timeout3 = setTimeout(updateHeadings, 1000);
			const timeout4 = setTimeout(updateHeadings, 2000);

			return () => {
				observer.disconnect();
				clearTimeout(timeout1);
				clearTimeout(timeout2);
				clearTimeout(timeout3);
				clearTimeout(timeout4);
			};
		}

		// Nếu chưa có post-body, thử lại sau
		const timeout = setTimeout(updateHeadings, 100);
		return () => clearTimeout(timeout);
	}, []);

	return { nestedHeadings };
};

export default useHeadingsData
