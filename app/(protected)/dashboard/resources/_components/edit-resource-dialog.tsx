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
import { Button } from "@/components/ui/button";
import { QuillEditor } from "@/components/quill-editor";
import { Switch } from "@/components/ui/switch";
import { upsertResourceSection } from "@/actions/resources/actions";
import { ResourceSectionSchema, TResourceSection } from "@/actions/resources/validations";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export function EditResourceDialog({ section }: { section: any }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<TResourceSection>({
		resolver: zodResolver(ResourceSectionSchema),
		defaultValues: {
			sectionId: section.sectionId,
			title: section.title,
			content: section.content || "",
			order: section.order,
			isActive: section.isActive,
		},
	});

	const onSubmit = async (values: TResourceSection) => {
		startTransition(async () => {
			const result = await upsertResourceSection(values);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success("Cập nhật thành công!");
			setOpen(false);
			router.refresh();
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Pencil className="w-4 h-4 mr-2" />
					Chỉnh sửa
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Chỉnh sửa nội dung</DialogTitle>
					<DialogDescription>
						Cập nhật nội dung cho section: {section.sectionId}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
										Số càng nhỏ, hiển thị càng trên
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
											Bật/tắt để hiển thị hoặc ẩn section này
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

