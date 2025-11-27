import {getPosts, getRandomPublishedPosts} from "@/actions/posts/queries";
import React from "react";
import PostCard from "@/components/public/posts/post-card";

export default function RelatedPosts(props :{
	postsPromise: ReturnType<typeof getRandomPublishedPosts>
}){
	const {data} = React.use(props.postsPromise)

	return (
		<div className={'container mx-auto max-w-[1400px] px-5 mt-10'}>
			<div className={'mb-3 p-5 rounded-t-md'}>
				<h3 className={'text-xl font-bold text-navyGray dark:text-white'}>Bài viết khác:</h3>
			</div>
			<div className={'grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5'}>
				{data?.map((post, index) => (
					<PostCard post={post} key={post.id} smallSize />
				))}
			</div>
		</div>
	)
}
