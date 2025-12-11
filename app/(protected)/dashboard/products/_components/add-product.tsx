'use client'

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MultiSelect} from "@/components/ui/multi-select";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/hooks/use-current-user";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getImageData, uploadFile} from "@/lib/image-data";

import '@/styles/quill/quill.css'
import {ACCEPTED_IMAGE_TYPES, getStatusText} from "@/enum/enums";
import { useToast } from "@/components/ui/use-toast"
import slug from "slug";
import {isSlug} from "validator";
import DetailPageLayout from "@/components/dashboard/detail-page-layout";
import {ProductStatus} from "@prisma/client";
import PageHeading, {PageHeadingInside} from "@/components/dashboard/page-heading";
import {
	AddProductSchema,
	defaultValueProduct,
	parseProductImages,
	TAddProductSchema,
	TProduct, UpdateProductSchema
} from "@/actions/products/validations";
import {addProduct, updateProduct} from "@/actions/products/actions";
import {toast} from "sonner";
import {redirect} from "next/navigation";
import MultiImageUpload from "@/app/(protected)/dashboard/products/_components/multi-image-upload";
import Link from "next/link";
import {EyeIcon} from "lucide-react";
import {QuillEditor} from "@/components/quill-editor";
import {cn} from "@/lib/utils";

const AddProduct = (props: {
	categories: any[],
	tags: any[],
	product?: TProduct | null
}) => {
	const user = useCurrentUser();
	const [isPending, startTransition] = useTransition();

	const [preview, setPreview] = useState(props.product?.image || "");
	const langViData = AddProductSchema.safeParse(props.product)

	const form = useForm<TAddProductSchema>({
		resolver: zodResolver(AddProductSchema),
		defaultValues: langViData.success ? {
			...defaultValueProduct,
			...langViData.data,
			categoryIDs: props.product?.categoryIDs || defaultValueProduct.categoryIDs,
			tagIDs: props.product?.tagIDs || defaultValueProduct.tagIDs,
			// images: langViData.success ? parseProductImages(langViData.data.images) : defaultValueProduct.images
		} : {
			...defaultValueProduct,
			authorId: user?.id,
		}
	})

	const onSubmit = async (values: TAddProductSchema) => {
		if(!isSlug(values.slug)) form.setValue('slug', slug(values.slug))

		startTransition(async () => {
			let imageUrl = ''
			if(values.image && typeof values.image === 'object'){
				const resImage = await uploadFile(values.image[0])
				const data = await resImage?.json();
				imageUrl = data.secure_url
			}

			if(props.product){
				const {error} = await updateProduct({
					...UpdateProductSchema.parse(form.getValues()),
					image: imageUrl || values.image,
				}, props.product.id!)

				if (error) {
					toast.error(error)
					return
				}

				toast.success("Update thành công")
			} else {
				const {data, error} = await addProduct({
					...AddProductSchema.parse(form.getValues()),
					image: imageUrl
				})

				if (error) {
					toast.error(error)
					return
				}

				toast.success("Tạo thành công")
				redirect(`/dashboard/products/${data?.id}`)
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
								title={'Sản phẩm'}
								backUrl={'/dashboard/products'}
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
												<FormItem className={'flex flex-col md:flex-row md:gap-5 hidden'}>
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

										<MultiImageUpload
											images={form.getValues('images')}
											handleChange={(e) => form.setValue('images', e)}
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

										<div className={cn("space-y-4")}>
											<FormField
												control={form.control}
												name="price"
												render={({ field }) => (
													<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
														<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
															Giá
														</FormLabel>
														<div className={'space-y-2 flex-grow'}>
															<FormControl>
																<Input
																	{...field}
																	disabled={isPending}
																	type={'number'}
																/>
															</FormControl>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="fakePrice"
												render={({ field }) => (
													<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
														<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
															Giá ảo
														</FormLabel>
														<div className={'space-y-2 flex-grow'}>
															<FormControl>
																<Input
																	{...field}
																	disabled={isPending}
																	type={'number'}
																/>
															</FormControl>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
										</div>

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
							<div className={'h-20 flex gap-3 items-end justify-end'}>
								{Boolean(props.product?.status === ProductStatus.PUBLISHED) && (
									<Button asChild variant={'outline'}>
										<Link href={`${process.env.NEXT_PUBLIC_APP_URL}/san-pham/${props.product?.slug}`} target={'_blank'}>
											<EyeIcon className={'size-4 mr-2'}/> View
										</Link>
									</Button>
								)}
								<Button
									type={'submit'}
									disabled={isPending}
								>
									{props.product ? 'Cập nhật' : 'Tạo Sản phẩm'}
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
						</DetailPageLayout.Right>
					</DetailPageLayout>
				</form>
			</Form>
		</div>
	)
}

export default AddProduct
