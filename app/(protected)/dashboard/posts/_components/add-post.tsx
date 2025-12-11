'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MultiSelect} from "@/components/ui/multi-select";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {useEffect, useState, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {addPost, updatePost} from "@/actions/posts/actions";
import {PostStatus, PostCategory} from ".prisma/client";

import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/hooks/use-current-user";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getImageData, uploadFile} from "@/lib/image-data";

import {ACCEPTED_IMAGE_TYPES, getStatusText} from "@/enum/enums";
import slug from "slug";
import {isSlug} from "validator";
import DetailPageLayout from "@/components/dashboard/detail-page-layout";
import {PageHeadingInside} from "@/components/dashboard/page-heading";
import {AddPostSchema, defaultValuePost, TPost, TAddPostSchema} from "@/actions/posts/validations";
import {toast} from "sonner";
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import {EyeIcon} from "lucide-react";
import RelatedLinksControl from "@/app/(protected)/dashboard/posts/_components/related-links-control";
import {parseLinkJson} from "@/actions/common/ralated-link-schema";
import {QuillEditor} from "@/components/quill-editor";

const AddPost = (props: {
	categories: any[],
	tags: any[],
	post?: TPost | null
}) => {
	const user = useCurrentUser();
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const [preview, setPreview] = useState(props.post?.image || "");


	const form = useForm<TAddPostSchema>({
		resolver: zodResolver(AddPostSchema),
		defaultValues: props.post ? {
			title: props.post.title || '',
			slug: props.post.slug || '',
			keywords: props.post.keywords || '',

			description: props.post.description || '',
			metaDescription: props.post.metaDescription || '',
			body: props.post.body || '',

			status: props.post.status || PostStatus.DRAFT,
			image: props.post.image || '',

			viewCount: props.post.viewCount || 0,
			relatedLinks: parseLinkJson(props.post.relatedLinks) || [],

			categoryIDs: props.post.categoryIDs || [],
			tagIDs: props.post.tagIDs || [],
			authorId: props.post.authorId || ''
		} : {
			...defaultValuePost,
			authorId: user?.id,
		}
	})

	const onSubmit = async (values: TAddPostSchema) => {
		if(!isSlug(values.slug)) form.setValue('slug', slug(values.slug))

		startTransition(async () => {
			let imageUrl = ''
			if(values.image && typeof values.image === 'object'){
				const resImage = await uploadFile(values.image[0])
				const data = await resImage?.json();
				imageUrl = data.secure_url
			}

			if(props.post){
				const {error} = await updatePost(
					{
						...values,
						image: imageUrl || values.image,
					},
					props.post.id!
				)

				if (error) {
					toast.error(`Cập nhật thất bại: ${error}`)
					return
				}

				toast.success("Đã cập nhật bài viết thành công")
				router.refresh()
			} else {
				const {data, error} = await addPost({
					...values,
					image: imageUrl
				})

				if (error) {
					toast.error(`Tạo bài viết thất bại: ${error}`)
					return
				}

				toast.success("Đã tạo bài viết thành công")
				redirect(`/dashboard/posts/${data?.id}`)
			}
		})
	}

	return (
		<div className="container">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<DetailPageLayout>
						<DetailPageLayout.Main>
							<PageHeadingInside
								title={'Bài viết'}
								backUrl={'/dashboard/posts'}
							/>

							<Card className={''}>
								<CardHeader className={'px-0 mx-6 pb-4 mb-4 border-b'}>
									<CardTitle>
										Thông tin
									</CardTitle>
								</CardHeader>

								<CardContent>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="image"
											render={({ field: {onChange, value, ...rest} }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Image
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<Avatar className="w-24 h-24 rounded-none">
															<AvatarImage src={preview || ""} />
															<AvatarFallback>Avatar</AvatarFallback>
														</Avatar>

														<FormControl>
															<Input
																type="file"
																{...rest}
																onChange={(event) => {
																	const { files, displayUrl} = getImageData(event)
																	setPreview(displayUrl);
																	onChange(files);
																}}
																accept={ACCEPTED_IMAGE_TYPES.join(',')}
																disabled={isPending}
															/>
														</FormControl>
														<FormDescription>
															Vui lòng chọn ảnh
														</FormDescription>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Tiêu đề
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<FormControl>
															<Input
																{...field}
																disabled={isPending}
																required
															/>
														</FormControl>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="slug"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Slug
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<div className="flex items-center space-x-2">
															<FormControl>
																<Input
																	{...field}
																	disabled={isPending}
																	required
																/>
															</FormControl>
															<Button
																type={'button'}
																variant={'secondary'}
																onClick={() => {
																	const sl = slug(form.getValues('title'))
																	form.setValue('slug', sl)
																}}
															>
																Generate
															</Button>
														</div>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Mô tả
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<FormControl>
															<Textarea
																{...field}
																disabled={isPending}
															/>
														</FormControl>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="metaDescription"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Mô tả SEO
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<FormControl>
															<Textarea
																{...field}
																disabled={isPending}
															/>
														</FormControl>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="body"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Nội dung
													</FormLabel>
													<div className={'flex-grow'}>
														<FormControl>
															<QuillEditor
																className={'prose max-w-none'}
																disabled={isPending}
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</DetailPageLayout.Main>
						<DetailPageLayout.Right>
							<div className={'h-20 flex-shrink-0 flex gap-3 items-end justify-end'}>
								{Boolean(props.post?.status === PostStatus.PUBLISHED) && (
									<Button asChild variant={'outline'}>
										<Link href={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${props.post?.slug}`} target={'_blank'}>
											<EyeIcon className={'size-4 mr-2'}/> View
										</Link>
									</Button>
								)}
								<Button
									type={'submit'}
									disabled={isPending}
								>
									{props.post ? 'Cập nhật' : 'Tạo Bài viết'}
								</Button>
							</div>

							<Card className={'p-6 flex flex-col gap-3 w-full'}>
								<FormField
									control={form.control}
									name={'status'}
									render={({field}) => (
										<FormItem>
											<FormLabel>Tình trạng</FormLabel>
											<Select
												value={field.value}
												disabled={isPending}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className="">
														<SelectValue placeholder="Tình trạng" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value={PostStatus.PUBLISHED}>{getStatusText(PostStatus.PUBLISHED)}</SelectItem>
													<SelectItem value={PostStatus.DRAFT}>{getStatusText(PostStatus.DRAFT)}</SelectItem>
													<SelectItem value={PostStatus.ARCHIVED}>{getStatusText(PostStatus.ARCHIVED)}</SelectItem>
												</SelectContent>
												<FormMessage />
											</Select>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="keywords"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Từ Khóa
											</FormLabel>
											<div className={'space-y-2 flex-grow'}>
												<FormControl>
													<Input
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormDescription>Ngăn cách bởi dấu phẩy </FormDescription>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="categoryIDs"
									render={({ field: { ...field }  }) => (
										<FormItem>
											<FormLabel>
												Danh mục
											</FormLabel>
											<div className={'space-y-2 flex-grow'}>
												<MultiSelect
													selected={field.value}
													options={props.categories.map(e => ({value: String(e.id), label: String(e.name)}))}
													{...field}
												/>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tagIDs"
									render={({ field: { ...field }  }) => (
										<FormItem>
											<FormLabel>
												Tag
											</FormLabel>
											<div className={'space-y-2 flex-grow'}>
												<MultiSelect
													selected={field.value}
													options={props.tags.map(e => ({value: String(e.id), label: String(e.name)}))}
													{...field}
												/>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
							</Card>

							<Card className={'p-6 flex flex-col gap-3 w-full'}>
								<RelatedLinksControl
									data={form.getValues('relatedLinks')}
									handleChange={(e) => form.setValue('relatedLinks', e)}
								/>
							</Card>
						</DetailPageLayout.Right>
					</DetailPageLayout>
				</form>
			</Form>
		</div>
	)
}

export default AddPost
