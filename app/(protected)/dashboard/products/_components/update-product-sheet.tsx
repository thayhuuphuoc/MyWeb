"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import {
	AddProductSchema, parseProductImages,
	defaultValueProduct,
	TAddProductSchema,
	TProduct
} from "@/actions/products/validations";
import {useCurrentUser} from "@/hooks/use-current-user";
import {updateProduct} from "@/actions/products/actions";
import {ProductStatus} from "@prisma/client";
import {getStatusText} from "@/enum/enums";
import {MultiSelect} from "@/components/ui/multi-select";
import {useProductsTable} from "@/app/(protected)/dashboard/products/_components/product-table-provider";

interface UpdateProductSheetProps	extends React.ComponentPropsWithRef<typeof Sheet> {
	product: TProduct,
}

export function UpdateProductSheet({ product, ...props }: UpdateProductSheetProps) {
	const user = useCurrentUser();
	const {constants} = useProductsTable()

	const [isUpdatePending, startUpdateTransition] = React.useTransition()

	const form = useForm<TAddProductSchema>({
		resolver: zodResolver(AddProductSchema),
		defaultValues: product ? {
			...defaultValueProduct,
			title: product.title || defaultValueProduct.title,
			slug: product.slug || defaultValueProduct.slug,
			keywords: product.keywords || defaultValueProduct.keywords,

			description: product.description || defaultValueProduct.description,
			metaDescription: product.metaDescription || defaultValueProduct.metaDescription,
			body: product.body || defaultValueProduct.body,

			status: product.status || defaultValueProduct.status,
			image: product.image || defaultValueProduct.image,
			images: parseProductImages(product.images) || defaultValueProduct.images,

			categoryIDs: product.categoryIDs || defaultValueProduct.categoryIDs,
			tagIDs: product.tagIDs || defaultValueProduct.tagIDs,
			authorId: product.authorId || defaultValueProduct.authorId
		} : {
			...defaultValueProduct,
			authorId: user?.id,
		}
	})

	function onSubmit(input: TAddProductSchema) {
		startUpdateTransition(async () => {
			const { error } = await updateProduct({
				...input,
			}, product.id)

			if (error) {
				toast.error(error)
				return
			}

			form.reset()
			props.onOpenChange?.(false)
			toast.success("Đã cập nhật Sản phẩm")
		})
	}

	useEffect(() => {
		form.setValue('title', product.title)
		form.setValue('slug', product.slug)
		form.setValue('keywords', product.keywords || "")

		form.setValue('description', product.description || "")
		form.setValue('metaDescription', product.metaDescription || "")
		form.setValue('body', product.body || "")

		form.setValue('status', product.status)
		form.setValue('image', product.image)
		form.setValue('images', parseProductImages(product.images))

		form.setValue('categoryIDs', product.categoryIDs)
		form.setValue('tagIDs', product.tagIDs)
		form.setValue('authorId', product.authorId)
	}, [product])

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md">
				<SheetHeader className="text-left">
					<SheetTitle>Cập nhật nhanh Sản phẩm</SheetTitle>
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
											<SelectItem value={ProductStatus.PUBLISHED}>{getStatusText(ProductStatus.PUBLISHED)}</SelectItem>
											<SelectItem value={ProductStatus.DRAFT}>{getStatusText(ProductStatus.DRAFT)}</SelectItem>
											<SelectItem value={ProductStatus.OUT_OF_STOCK}>{getStatusText(ProductStatus.OUT_OF_STOCK)}</SelectItem>
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
