"use client";

import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {ChangeEvent, useState, useTransition} from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {AvatarSchema} from "@/schemas/auth.schema";
import {useCurrentUser} from "@/hooks/use-current-user";
import {FormError} from "@/components/forms/form-error";
import {FormSuccess} from "@/components/forms/form-success";
import {updateProfileImage} from "@/actions/auth/profile";
import {useSession} from "next-auth/react";
import {FormInfo} from "@/components/forms/form-info";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useIntersectionObserver} from "usehooks-ts";
import {getImageData, uploadFile} from "@/lib/image-data";
import {ACCEPTED_IMAGE_TYPES} from "@/enum/enums";

function UploadAvatar(props: {
	observe: () => void
}) {
	const [ref, entry] = useIntersectionObserver({
		threshold: 1,
		root: null,
		rootMargin: "32px",
		onChange: isIntersecting => {
			isIntersecting && props.observe()
		}
	});

	const user = useCurrentUser();

	const [preview, setPreview] = useState("");
	const form = useForm<z.infer<typeof AvatarSchema>>({
		resolver: zodResolver(AvatarSchema),
	});

	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const { update } = useSession();


	async function onSubmit(values: z.infer<typeof AvatarSchema>) {
		startTransition(async () => {
			try {
				const resImage = await uploadFile(values.image[0])
				const data = await resImage?.json();

				const res = await updateProfileImage({
					image: data.secure_url
				})

				if (res.error) {
					setError(res.error);
				}

				if (res.success) {
					update();
					setSuccess(res.success);
				}
			} catch (e) {
				if (process.env.NODE_ENV === 'development') {
					console.error("Error uploading avatar:", e);
				}
				setError('Đã xảy ra lỗi!')
			}
		})
	}

	return (
		<Card className={'mb-8 scroll-mt-20'} id={'avatar'} ref={ref}>
			<CardHeader className={'px-0 mx-6 pb-4 mb-4 border-b'}>
				<CardTitle>
					Ảnh đại diện
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-8"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex gap-8">
							<Avatar className="w-24 h-24">
								<AvatarImage src={preview || user?.image || ""} />
								<AvatarFallback>Avatar</AvatarFallback>
							</Avatar>
							<FormField
								control={form.control}
								name="image"
								render={({ field: { onChange, value, ...rest } }) => (
									<>
										<FormItem>
											<FormLabel>Ảnh đại diện</FormLabel>
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
										</FormItem>
									</>
								)}
							/>
						</div>
						{Boolean(isPending) && (
							<FormInfo message={'Đang tải ảnh, vui lòng chờ'}/>
						)}
						{!Boolean(isPending) && (
							<FormError message={error} />
						)}
						{!Boolean(isPending) && (
							<FormSuccess message={success} />
						)}
						<div className="flex gap-3">
							<Button
								disabled={isPending}
								type="submit"
								variant={'secondary'}
							>
								Cập nhật
							</Button>
							<Button
								asChild={true}
								disabled={isPending}
								type={'reset'} variant={'outline'} onClick={()=>setPreview("")}
							>
								Reset
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default UploadAvatar
