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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuillEditor } from "@/components/quill-editor";
import { upsertResourceSection } from "@/actions/resources/actions";
import { ResourceSectionSchema, TResourceSection } from "@/actions/resources/validations";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import slug from "slug";

export function CreateResourceDialog() {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const form = useForm<TResourceSection>({
		resolver: zodResolver(ResourceSectionSchema),
		defaultValues: {
			sectionId: "",
			title: "",
			content: "",
			order: 0,
			isActive: true,
		},
	});

	const onSubmit = async (values: TResourceSection) => {
		// Auto-generate sectionId from title if empty
		if (!values.sectionId && values.title) {
			values.sectionId = slug(values.title.toLowerCase());
		}

		startTransition(async () => {
			const result = await upsertResourceSection(values);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success("Tạo section thành công!");
			form.reset();
			setOpen(false);
			// Refresh page to show new section
			window.location.reload();
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4 mr-2" />
					Thêm Section mới
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Tạo Section mới</DialogTitle>
					<DialogDescription>
						Tạo một section mới cho trang Tài nguyên
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tiêu đề *</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending} placeholder="Ví dụ: Phần mềm" />
									</FormControl>
									<FormDescription>
										Tiêu đề sẽ hiển thị trên sidebar navigation
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sectionId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section ID *</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											disabled={isPending} 
											placeholder="phan-mem (tự động tạo từ tiêu đề)"
											onChange={(e) => {
												field.onChange(e);
												// Auto-generate from title if empty
												if (!e.target.value && form.getValues("title")) {
													form.setValue("sectionId", slug(form.getValues("title").toLowerCase()));
												}
											}}
										/>
									</FormControl>
									<FormDescription>
										ID duy nhất cho section (dạng slug, không dấu, không khoảng trắng)
									</FormDescription>
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
										Số càng nhỏ, hiển thị càng trên (mặc định: 0)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nội dung</FormLabel>
									<FormControl>
										<QuillEditor
											className="prose max-w-none min-h-[400px]"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setOpen(false);
									form.reset();
								}}
								disabled={isPending}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Đang tạo..." : "Tạo"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}


















