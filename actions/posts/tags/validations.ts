import {z} from "@/locales/zod-custom"
import {Prisma, PostTag} from "@prisma/client";
import PostTagCreateInput = Prisma.PostTagCreateInput;
import PostTagUpdateInput = Prisma.PostTagUpdateInput;
import PostTagGetPayload = Prisma.PostTagGetPayload;
import slug from "slug";

export type TPostTagCreateInput = PostTagCreateInput
export type TPostTagUpdateInput = PostTagUpdateInput
export type TPostTag = PostTag
export type TPostTagWithPostCount = PostTagGetPayload<{
	select: {
		id: true,
		slug: true,
		name: true,
		description: true,
		metaDescription: true,
		_count: {
			select: {
				posts: true
			}
		}
	}
}>
