import * as z from "zod";

export const DocumentationSectionSchema = z.object({
	sectionId: z.string().min(1, "Section ID là bắt buộc"),
	title: z.string().min(1, "Tiêu đề là bắt buộc"),
	content: z.string().optional(),
	order: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

export type TDocumentationSection = z.infer<typeof DocumentationSectionSchema>;

export const defaultDocumentationSections = [
	{
		sectionId: "introduction",
		title: "Giới thiệu",
		content: "",
		order: 1,
		isActive: true,
	},
	{
		sectionId: "structure",
		title: "Cấu trúc dự án",
		content: "",
		order: 2,
		isActive: true,
	},
	{
		sectionId: "quick-start",
		title: "Bắt đầu nhanh",
		content: "",
		order: 3,
		isActive: true,
	},
	{
		sectionId: "configuration",
		title: "Cấu hình",
		content: "",
		order: 4,
		isActive: true,
	},
];


















