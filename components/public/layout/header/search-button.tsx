"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function SearchButton() {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			router.push(`/blog/tim-kiem?title=${encodeURIComponent(searchTerm)}`);
			setOpen(false);
			setSearchTerm("");
		}
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setOpen(true)}
				className="w-9 h-9"
			>
				<Search className="h-4 w-4" />
				<span className="sr-only">Search</span>
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Tìm kiếm</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSearch} className="mt-4">
						<Input
							type="search"
							placeholder="Nhập từ khóa tìm kiếm..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full"
							autoFocus
						/>
						<Button type="submit" className="mt-4 w-full">
							Tìm kiếm
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}



