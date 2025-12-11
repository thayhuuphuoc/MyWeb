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
import { Textarea } from "@/components/ui/textarea"

import {
	TProductTagWithProductCount,
	TUpdateProductTagSchema,
	updateProductTagSchema
} from "@/actions/products/tags/validations";
import {updateProductTag} from "@/actions/products/tags/actions";
import {Input} from "@/components/ui/input";
import slug from "slug";
import {useEffect} from "react";

interface UpdateTagSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	tag: TProductTagWithProductCount
}

export function UpdateProductTagSheet({ tag, ...props }: UpdateTagSheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition()

	const form = useForm<TUpdateProductTagSchema>({
		resolver: zodResolver(updateProductTagSchema),
		defaultValues: {
			name: tag.name ?? "",
			slug: tag.slug ?? "",
		}
	})

	function onSubmit(input: TUpdateProductTagSchema) {
		startUpdateTransition(async () => {
			const { error } = await updateProductTag({
				...input,
			}, tag.id)

			if (error) {
				toast.error(error)
				return
			}

			form.reset()
			props.onOpenChange?.(false)
			toast.success("Đã cập nhật Tag")
		})
	}

	useEffect(() => {
		form.setValue('name', tag.name)
		form.setValue('slug', tag.slug)
	}, [tag])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md">
				<SheetHeader className="text-left">
					<SheetTitle>Cập nhật Tag</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
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
