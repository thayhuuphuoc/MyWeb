"use client";

import { useState, useTransition } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteResourceSection } from "@/actions/resources/actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteResourceDialog({ section }: { section: any }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleDelete = () => {
		startTransition(async () => {
			const result = await deleteResourceSection(section.sectionId);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success("Xóa section thành công!");
			setOpen(false);
			router.refresh();
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm">
					<Trash2 className="w-4 h-4 mr-2" />
					Xóa
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
					<AlertDialogDescription>
						Bạn có chắc chắn muốn xóa section <strong>&quot;{section.title}&quot;</strong>?
						<br />
						Hành động này không thể hoàn tác.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isPending}
						className="bg-red-600 hover:bg-red-700"
					>
						{isPending ? "Đang xóa..." : "Xóa"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

