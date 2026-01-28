import {z} from "@/locales/zod-custom";
import {Prisma} from "@prisma/client";

export const RelatedLinkSchema = z.object({
	name: z.string(),
	url: z.string(),
	index: z.number()
})
export type TRelatedLink = z.infer<typeof RelatedLinkSchema>
export const createLinkFromJson = (content: string): TRelatedLink => {
	return z
	.string()
	.transform((_, ctx) => {
		try {
			return JSON.parse(content);
		} catch (error) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'invalid json',
			});
			return z.never;
		}
	})
	.pipe(RelatedLinkSchema)
	.parse(content);
};
export const parseLinkJson = (content: Prisma.JsonValue[]): TRelatedLink[] => {
	return content.map(t => createLinkFromJson(JSON.stringify(t)))
}
