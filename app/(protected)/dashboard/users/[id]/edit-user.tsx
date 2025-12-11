'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {zodResolver} from "@hookform/resolvers/zod";

import {TUserPayload, TUserPayloadFull, updateUser} from "@/actions/users/users";
import {useEffect, useTransition} from "react";
import {useForm} from "react-hook-form";
import {UserRole, UserStatus} from "@prisma/client";
import {useToast} from "@/components/ui/use-toast";
import DetailPageLayout from "@/components/dashboard/detail-page-layout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getRoleText, getStatusText} from "@/enum/enums";
import {EditUserSchema, TEditUserSchema} from "@/schemas/user.schema";
import PageHeading, {PageHeadingInside} from "@/components/dashboard/page-heading";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";

const EditUser = (props: {
	user?: TUserPayloadFull | null
}) => {
	const { toast } = useToast()
	const [isPending, startTransition] = useTransition();

	const form = useForm<TEditUserSchema>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: props.user ? {
			name: props.user.name || undefined,
			image: props.user.image || undefined,
			visible: props.user.visible || undefined,
			address: props.user.address || undefined,
			phoneNum: props.user.phoneNum || undefined,
			password: props.user.password || undefined,
			status: props.user.status || undefined,
			role: props.user.role || undefined,
		} : {}
	})

	const onSubmit = async (values: TEditUserSchema) => {
		startTransition(async () => {
			try{
				const data = await updateUser(values, props.user?.id || "")
				if (data.error) {
					throw new Error(data.error)
				}
				if (data.success) {
					toast({
						title: '👍 Thành công',
						description: data.success,
					})
				}
			} catch (e: any) {
				if (process.env.NODE_ENV === 'development') {
					console.error("Error editing user:", e);
				}
				toast({
					title: '😵 Oh, có lỗi xảy ra',
					description: e?.message,
					variant: 'destructive'
				})
			}
		})
	}

	return (
		<div className={'container'}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<DetailPageLayout>
						<DetailPageLayout.Main>
							<PageHeadingInside
								title={'Edit Người Dùng'}
								backUrl={'/dashboard/users'}
							/>

							<Card className={''}>
								<CardHeader className={'px-0 mx-6 pb-4 mb-4 border-b'}>
									<CardTitle>
										Thông tin
									</CardTitle>
								</CardHeader>

								<CardContent>
									<div className="space-y-4">
										<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
											<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
												Email
											</FormLabel>
											<div className={'space-y-2 flex-grow'}>
												<p className="text-sm my-1.5">{props.user?.email}</p>
											</div>
										</FormItem>

										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Họ tên
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<FormControl>
															<Input
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
											name="address"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Địa chỉ
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<FormControl>
															<Input
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
											name="password"
											render={({ field }) => (
												<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
													<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
														Mật khẩu
													</FormLabel>
													<div className={'space-y-2 flex-grow'}>
														<FormControl>
															<Input
																{...field}
																disabled={isPending}
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
							<div className={'h-20 flex flex-col justify-end'}>
								<Button
									type={'submit'}
									disabled={isPending}
								>
									Cập nhật
								</Button>
							</div>

							<Card className={'p-6 flex flex-col gap-3 w-full'}>
								<FormField
									control={form.control}
									name={'role'}
									render={({field}) => (
										<FormItem>
											<FormLabel>Quyền</FormLabel>
											<Select
												value={field.value}
												disabled={isPending}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className="">
														<SelectValue placeholder="Quyền" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.values(UserRole).map((val, index) => (
														<SelectItem key={index} value={val}>{getRoleText(val)}</SelectItem>
													))}
												</SelectContent>
												<FormMessage />
											</Select>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={'status'}
									render={({field}) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<div className={'space-y-2 flex-grow'}>
												<Select
													value={field.value}
													disabled={isPending}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger className="">
															<SelectValue placeholder="Status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.values(UserStatus).map((val, index) => (
															<SelectItem key={index} value={val}>{getStatusText(val)}</SelectItem>
														))}
													</SelectContent>
												</Select>
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

export default EditUser
