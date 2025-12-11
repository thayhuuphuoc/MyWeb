import * as z from "zod";

export const ResourceSectionSchema = z.object({
	sectionId: z.string().min(1, "Section ID là bắt buộc"),
	title: z.string().min(1, "Tiêu đề là bắt buộc"),
	content: z.string().optional(),
	order: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

export type TResourceSection = z.infer<typeof ResourceSectionSchema>;

export const defaultResourceSections = [
	{
		sectionId: "phan-mem",
		title: "Phần mềm",
		content: "",
		order: 1,
		isActive: true,
	},
	{
		sectionId: "cong-cu",
		title: "Công cụ",
		content: "",
		order: 2,
		isActive: true,
	},
	{
		sectionId: "ebook",
		title: "Ebook – Giáo trình",
		content: "",
		order: 3,
		isActive: true,
	},
	{
		sectionId: "website",
		title: "Website hữu ích",
		content: "",
		order: 4,
		isActive: true,
	},
	{
		sectionId: "downloads",
		title: "Downloads",
		content: "",
		order: 5,
		isActive: true,
	},
];


















