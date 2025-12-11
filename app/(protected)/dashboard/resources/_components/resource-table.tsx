"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EditResourceDialog } from "./edit-resource-dialog";
import { DeleteResourceDialog } from "./delete-resource-dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState, useTransition } from "react";
import { upsertResourceSection } from "@/actions/resources/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ResourceTable({ sections }: { sections: any[] }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleMove = (section: any, direction: "up" | "down") => {
		const sortedSections = [...sections].sort((a, b) => a.order - b.order);
		const currentIndex = sortedSections.findIndex((s) => s.id === section.id);

		if (
			(direction === "up" && currentIndex === 0) ||
			(direction === "down" && currentIndex === sortedSections.length - 1)
		) {
			return;
		}

		const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
		const targetSection = sortedSections[targetIndex];

		// Swap orders
		const newOrder = targetSection.order;
		const oldOrder = section.order;

		startTransition(async () => {
			// Update current section
			await upsertResourceSection({
				...section,
				order: newOrder,
			});

			// Update target section
			await upsertResourceSection({
				...targetSection,
				order: oldOrder,
			});

			toast.success("Đã cập nhật thứ tự");
			router.refresh();
		});
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Tiêu đề</TableHead>
						<TableHead>Section ID</TableHead>
						<TableHead>Thứ tự</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead className="text-right">Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sections.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center py-8 text-navyGray dark:text-white/60">
								Chưa có nội dung. Vui lòng tạo section mới.
							</TableCell>
						</TableRow>
					) : (
						[...sections]
							.sort((a, b) => a.order - b.order)
							.map((section, index) => (
								<TableRow key={section.id}>
									<TableCell className="font-medium">{section.title}</TableCell>
									<TableCell>{section.sectionId}</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<span>{section.order}</span>
											<div className="flex flex-col gap-0.5">
												<Button
													variant="ghost"
													size="icon"
													className="h-5 w-5"
													onClick={() => handleMove(section, "up")}
													disabled={isPending || index === 0}
												>
													<ArrowUp className="h-3 w-3" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="h-5 w-5"
													onClick={() => handleMove(section, "down")}
													disabled={isPending || index === sections.length - 1}
												>
													<ArrowDown className="h-3 w-3" />
												</Button>
											</div>
										</div>
									</TableCell>
									<TableCell>
										{section.isActive ? (
											<span className="text-green-600">Hoạt động</span>
										) : (
											<span className="text-gray-400">Ẩn</span>
										)}
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-end gap-2">
											<EditResourceDialog section={section} />
											<DeleteResourceDialog section={section} />
										</div>
									</TableCell>
								</TableRow>
							))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

