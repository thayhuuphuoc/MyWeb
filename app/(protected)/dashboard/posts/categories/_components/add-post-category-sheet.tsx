"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {ReloadIcon} from "@radix-ui/react-icons"
import {useForm} from "react-hook-form"
import {toast} from "sonner"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle,} from "@/components/ui/sheet"
import {Textarea} from "@/components/ui/textarea"

import {TPostCategoryWithPostCount} from "@/actions/posts/categories/validations";
import {addPostCategory, updatePostCategory} from "@/actions/posts/categories/actions";
import {Input} from "@/components/ui/input";
import slug from "slug";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getImageData, uploadFile} from "@/lib/image-data";
import {ACCEPTED_IMAGE_TYPES} from "@/enum/enums";
import {createCategorySchema, defaultCatValue, TCreateCategorySchema} from "@/actions/common/category-schema";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

interface AddCategorySheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	data?: TPostCategoryWithPostCount | null
}

export function AddPostCategorySheet({ data, ...props }: AddCategorySheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition()
	const [previewVi, setPreviewVi] = useState("");

	const form = useForm<TCreateCategorySchema>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {...defaultCatValue}
	})

	function onSubmit(input: TCreateCategorySchema) {
		startUpdateTransition(async () => {
			let imageUrl = ''
			if(input.image && typeof input.image === 'object'){
				const resImage = await uploadFile(input.image[0])
				const data = await resImage?.json();
				imageUrl = data.secure_url
			}

			if(data?.id){
				const {error} = await updatePostCategory({
					...input,
					image: imageUrl || input.image,
				}, data.id)

				if (error) {
					toast.error(error)
					return
				}

				props.onOpenChange?.(false)
				toast.success("Đã cập nhật Category")
			} else {
				const { error } = await addPostCategory({
					...input,
					image: imageUrl
				})

				if (error) {
					toast.error(error)
					return
				}

				props.onOpenChange?.(false)
				toast.success("Tạo thành công")
			}
		})
	}

	useEffect(() => {
		form.reset()

		form.setValue('name', data?.name || "")
		form.setValue('slug', data?.slug || "")
		form.setValue('image', data?.image || "")
		form.setValue('description', data?.description || "")
		form.setValue('metaDescription', data?.metaDescription || "")
		setPreviewVi(data?.image || "")
	}, [props.open])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md p-2">
				<SheetHeader className="text-left p-4">
					<SheetTitle>{data ? 'Cập nhật Category' : 'Tạo thêm Category'}</SheetTitle>
				</SheetHeader>
				<ScrollArea className={'p-4'}>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className={cn("flex flex-col gap-4")}
						>
							<FormField
								control={form.control}
								name="name"
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
														const sl = slug(form.getValues('name') || "")
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
								name="image"
								render={({ field: {onChange, value, ...rest} }) => (
									<FormItem className={''}>
										<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
											Ảnh
										</FormLabel>
										<div className={'space-y-2 flex-grow'}>
											<Avatar className="w-24 h-24 rounded-none">
												<AvatarImage src={previewVi || ""} />
												<AvatarFallback>Avatar</AvatarFallback>
											</Avatar>

											<FormControl>
												<Input
													type="file"
													{...rest}
													onChange={(event) => {
														const { files, displayUrl} = getImageData(event)
														setPreviewVi(displayUrl)
														onChange(files);
													}}
													accept={ACCEPTED_IMAGE_TYPES.join(',')}
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
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Mô tả
										</FormLabel>
										<div className={'space-y-2 flex-grow'}>
											<FormControl>
												<Textarea
													{...field}
												/>
											</FormControl>
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
									{data ? 'Lưu' : 'Tạo'}
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
