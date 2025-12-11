"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl, FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import {Input} from "@/components/ui/input";
import slug from "slug";
import {useEffect} from "react";
import {AddPostSchema, defaultValuePost, TAddPostSchema, TPost} from "@/actions/posts/validations";
import {useCurrentUser} from "@/hooks/use-current-user";
import {updatePost} from "@/actions/posts/actions";
import {PostStatus} from "@prisma/client";
import {getStatusText} from "@/enum/enums";
import {MultiSelect} from "@/components/ui/multi-select";
import {usePostsTable} from "@/app/(protected)/dashboard/posts/_components/post-table-provider";
import {parseLinkJson} from "@/actions/common/ralated-link-schema";

interface UpdatePostSheetProps	extends React.ComponentPropsWithRef<typeof Sheet> {
	post: TPost,
}

export function UpdatePostSheet({ post, ...props }: UpdatePostSheetProps) {
	const user = useCurrentUser();
	const {constants} = usePostsTable()
	const router = useRouter()

	const [isUpdatePending, startUpdateTransition] = React.useTransition()

	const form = useForm<TAddPostSchema>({
		resolver: zodResolver(AddPostSchema),
		defaultValues: defaultValuePost
	})

	function onSubmit(input: TAddPostSchema) {
		startUpdateTransition(async () => {
			const { error } = await updatePost({
				...input,
			}, post.id)

			if (error) {
				toast.error(`Cập nhật thất bại: ${error}`)
				return
			}

			form.reset()
			props.onOpenChange?.(false)
			toast.success("Đã cập nhật bài viết thành công")
			router.refresh()
		})
	}

	useEffect(() => {
		form.setValue('title', post.title)
		form.setValue('slug', post.slug)
		form.setValue('keywords', post.keywords || "")

		form.setValue('description', post.description || "")
		form.setValue('metaDescription', post.metaDescription || "")
		form.setValue('body', post.body || "")

		form.setValue('status', post.status)
		form.setValue('image', post.image)

		form.setValue('viewCount', post.viewCount)
		form.setValue('relatedLinks', parseLinkJson(post.relatedLinks))

		form.setValue('categoryIDs', post.categoryIDs)
		form.setValue('tagIDs', post.tagIDs)
		form.setValue('authorId', post.authorId)
	}, [post])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md">
				<SheetHeader className="text-left">
					<SheetTitle>Cập nhật nhanh Bài viết</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Tên
									</FormLabel>
									<div className={'space-y-2 flex-grow'}>
										<FormControl>
											<Input
												{...field}
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
								<FormItem>
									<FormLabel>
										Slug
									</FormLabel>
									<div className={'space-y-2 flex-grow'}>
										<div className="flex items-center space-x-2">
											<FormControl>
												<Input
													{...field}
													required
												/>
											</FormControl>
											<Button
												type={'button'}
												variant={'secondary'}
												onClick={() => {
													const sl = slug(form.getValues('title') || "")
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
							name={'status'}
							render={({field}) => (
								<FormItem>
									<FormLabel>Tình trạng</FormLabel>
									<Select
										value={field.value}
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
											<SelectItem value={PostStatus.PENDING}>{getStatusText(PostStatus.PENDING)}</SelectItem>
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
											/>
										</FormControl>
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
											options={constants.categories.map(e => ({value: String(e.id), label: String(e.name)}))}
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
											options={constants.tags.map(e => ({value: String(e.id), label: String(e.name)}))}
											{...field}
										/>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<SheetFooter className="gap-2 pt-2 sm:space-x-0">
							<SheetClose asChild>
								<Button type="button" variant="outline">
									Hủy
								</Button>
							</SheetClose>
							<Button disabled={isUpdatePending}>
								{isUpdatePending && (
									<ReloadIcon
										className="mr-2 size-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								Lưu
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
