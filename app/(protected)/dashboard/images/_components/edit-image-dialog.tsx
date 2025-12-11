"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateImageCarousel } from "@/actions/image-carousel/actions";
import { ImageCarouselSchema, TImageCarousel } from "@/actions/image-carousel/validations";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/image-data";

export function EditImageDialog({ image }: { image: any }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [preview, setPreview] = useState(image.imageUrl || "");

	const [imageFile, setImageFile] = useState<File | null>(null);

	const form = useForm<TImageCarousel>({
		resolver: zodResolver(ImageCarouselSchema),
		defaultValues: {
			imageUrl: image.imageUrl,
			title: image.title || "",
			description: image.description || "",
			order: image.order,
			isActive: image.isActive,
		},
	});

	const onSubmit = async (values: TImageCarousel) => {
		startTransition(async () => {
			try {
				let imageUrl = values.imageUrl;

				// If imageFile exists, upload it
				if (imageFile) {
					// Kiểm tra env variables
					if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
						toast.error("Cấu hình Cloudinary chưa được thiết lập. Vui lòng kiểm tra biến môi trường.");
						return;
					}

					const resImage = await uploadFile(imageFile);
					if (!resImage) {
						toast.error("Lỗi khi upload hình ảnh. Vui lòng kiểm tra cấu hình Cloudinary.");
						return;
					}

					if (!resImage.ok) {
						const errorText = await resImage.text();
						toast.error(`Lỗi upload: ${resImage.status} - ${errorText}`);
						return;
					}

					const data = await resImage.json();
					
					if (!data || !data.secure_url) {
						toast.error("Không nhận được URL hình ảnh từ Cloudinary.");
						return;
					}

					imageUrl = data.secure_url;
				}

				// If no new image and no existing imageUrl, show error
				if (!imageUrl) {
					toast.error("Vui lòng chọn hình ảnh");
					return;
				}

				const result = await updateImageCarousel(image.id, {
					...values,
					imageUrl,
				});

				if (result.error) {
					toast.error(result.error);
					return;
				}

				toast.success("Cập nhật thành công!");
				setOpen(false);
				router.refresh();
			} catch (error: any) {
				toast.error(`Lỗi: ${error?.message || "Có lỗi xảy ra khi upload hình ảnh"}`);
			}
		});
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const preview = URL.createObjectURL(file);
			setPreview(preview);
			setImageFile(file);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Pencil className="w-4 h-4 mr-2" />
					Chỉnh sửa
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
					<DialogDescription>
						Cập nhật thông tin hình ảnh
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormItem>
							<FormLabel>Hình ảnh *</FormLabel>
							<FormControl>
								<div className="space-y-4">
									<Input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										disabled={isPending}
									/>
									{preview && (
										<div className="relative w-full h-64 rounded-lg overflow-hidden border">
											<img
												src={preview}
												alt="Preview"
												className="w-full h-full object-cover"
											/>
										</div>
									)}
									{!preview && image.imageUrl && (
										<div className="relative w-full h-64 rounded-lg overflow-hidden border">
											<img
												src={image.imageUrl}
												alt={image.title || "Current image"}
												className="w-full h-full object-cover"
											/>
										</div>
									)}
								</div>
							</FormControl>
							<FormDescription>
								Upload hình ảnh mới hoặc giữ nguyên hình ảnh hiện tại
							</FormDescription>
						</FormItem>

						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tiêu đề</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mô tả</FormLabel>
									<FormControl>
										<Textarea {...field} disabled={isPending} rows={3} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="order"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Thứ tự</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											disabled={isPending}
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
										/>
									</FormControl>
									<FormDescription>
										Số càng nhỏ, hiển thị càng trước
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Hiển thị</FormLabel>
										<FormDescription>
											Bật/tắt để hiển thị hoặc ẩn hình ảnh này
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isPending}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isPending}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Đang lưu..." : "Lưu"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

