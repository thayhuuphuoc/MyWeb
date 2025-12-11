"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {createProductTagSchema, TCreateProductTagSchema} from "@/actions/products/tags/validations";
import {addProductTag} from "@/actions/products/tags/actions";
import {Input} from "@/components/ui/input";
import slug from "slug";

export function CreateProductTagDialog() {
	const [open, setOpen] = React.useState(false)
	const [isCreatePending, startCreateTransition] = React.useTransition()

	const form = useForm<TCreateProductTagSchema>({
		resolver: zodResolver(createProductTagSchema),
	})

	function onSubmit(input: TCreateProductTagSchema) {
		startCreateTransition(async () => {
			const { error } = await addProductTag(input)

			if (error) {
				toast.error(error)
				return
			}

			form.reset()
			setOpen(false)
			toast.success("Tạo thành công")
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<PlusIcon className="mr-2 size-4" aria-hidden="true" />
					Thêm Tag
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tạo thêm Tag</DialogTitle>
				</DialogHeader>
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

						<DialogFooter className="gap-2 pt-2 sm:space-x-0">
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Hủy
								</Button>
							</DialogClose>
							<Button disabled={isCreatePending}>
								{isCreatePending && (
									<ReloadIcon
										className="mr-2 size-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								Tạo
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
