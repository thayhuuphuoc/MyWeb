import {Prisma, PostCategory} from "@prisma/client";
import PostCategoryCreateInput = Prisma.PostCategoryCreateInput;
import PostCategoryUpdateInput = Prisma.PostCategoryUpdateInput;
import PostCategoryGetPayload = Prisma.PostCategoryGetPayload;

export type TPostCategoryCreateInput = PostCategoryCreateInput
export type TPostCategoryUpdateInput = PostCategoryUpdateInput
export type TPostCategory = PostCategory
export type TPostCategoryWithPostCount = PostCategoryGetPayload<{
	select: {
		id: true,
		slug: true,
		name: true,
		image: true,
		description: true,
		metaDescription: true,
		_count: {
			select: {
				posts: true
			}
		}
	}
}>
