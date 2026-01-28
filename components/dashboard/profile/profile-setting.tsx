'use client'

import {useCurrentUser} from "@/hooks/use-current-user";
import {useState, useTransition} from "react";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {ProfileSchema} from "@/schemas/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FormError} from "@/components/forms/form-error";
import {FormSuccess} from "@/components/forms/form-success";
import {Button} from "@/components/ui/button";
import {updateProfile} from "@/actions/auth/profile";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useIntersectionObserver} from "usehooks-ts";

export default function ProfileSetting(props: {
	observe: () => void
}) {
	const [ref, entry] = useIntersectionObserver({
		threshold: 1,
		root: null,
		rootMargin: "0px",
		onChange: isIntersecting => {
			isIntersecting && props.observe()
		}
	});

	const user = useCurrentUser();

	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: user?.name || undefined,
			image: user?.image || undefined,

			visible: user?.visible || false,
			phoneNum: user?.phoneNum || undefined,
		}
	});

	const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			updateProfile(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}

					if (data.success) {
						update();
						setSuccess(data.success);
					}
				})
				.catch(() => setError("Đã xảy ra lỗi!"));
		});
	}

	return (
		<Card className={'mb-8 scroll-mt-20'} id={'profile'} ref={ref}>
			<CardHeader className={'px-0 mx-6 pb-4 mb-4 border-b'}>
				<CardTitle>
					Hồ Sơ
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-6 max-w-lg"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="space-y-4">
							{/*name*/}
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
													placeholder="Nguyễn Văn A"
													disabled={isPending}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							{/*phoneNum*/}
							<FormField
								control={form.control}
								name="phoneNum"
								render={({ field }) => (
									<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
										<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
											Số điện thoại
										</FormLabel>
										<div className={'space-y-2 flex-grow'}>
											<FormControl>
												<Input
													{...field}
													placeholder="Điền số điện thoại của bạn"
													disabled={isPending}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button
							variant={'secondary'}
							disabled={isPending}
							type="submit"
						>
							Lưu lại
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
