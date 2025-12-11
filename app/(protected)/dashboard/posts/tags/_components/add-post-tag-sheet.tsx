"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"

import {
	TPostTagWithPostCount
} from "@/actions/posts/tags/validations";
import {addPostTag, updatePostTag} from "@/actions/posts/tags/actions";
import {Input} from "@/components/ui/input";
import slug from "slug";
import {useEffect, useState} from "react";
import {createTagSchema, defaultTagValue, TCreateTagSchema} from "@/actions/common/tag-schema";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";

interface AddTagSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	data?: TPostTagWithPostCount
}

export function AddPostTagSheet({ data, ...props }: AddTagSheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition()

	const form = useForm<TCreateTagSchema>({
		resolver: zodResolver(createTagSchema),
		defaultValues: defaultTagValue
	})

	function onSubmit(input: TCreateTagSchema) {
		startUpdateTransition(async () => {
			if(data?.id){
				const {error} = await updatePostTag({
					...input,
				}, data.id)

				if (error) {
					toast.error(error)
					return
				}

				props.onOpenChange?.(false)
				toast.success("Đã cập nhật Tag")
			} else {
				const { error } = await addPostTag(input)

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
		form.setValue('description', data?.description || "")
		form.setValue('metaDescription', data?.metaDescription || "")
	}, [props.open])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md p-2">
				<SheetHeader className="text-left p-4">
					<SheetTitle>{data ? 'Cập nhật Tag' : 'Tạo thêm Tag'}</SheetTitle>
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
							<FormField
								control={form.control}
								name="metaDescription"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Mô tả SEO
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
									Lưu
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}
