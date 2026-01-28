import {Button} from "@/components/ui/button";
import Link from "next/link";
import {MoreHorizontal, SquarePen, Trash} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import React, {useState} from "react";

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
} from "@/components/ui/alert-dialog"
import {deleteUser} from "@/actions/users/users";

const ActionCol = (props: any) => {
	const {toast, row, setData, data} = props
	const item = row.original
	
	const [show, setShow] = useState(false)
	
	const deleteFn = async () => {
		try {
			const res = await deleteUser(item.id!)
			
			// delete data
			const dataCopy = [...data];
			dataCopy.splice(row.index, 1);
			setData(dataCopy)
			
			// toast
			toast({
				title: `👍 Xóa "${item.email}" Thành công`,
			})
		} catch (e) {
			if (process.env.NODE_ENV === 'development') {
				console.error("Error deleting user:", e);
			}
			toast({
				title: '😵 Oh, có lỗi xảy ra',
				description: `Không thể xóa "${item.email}"`,
				variant: 'destructive'
			})
		}
	}
	
	return (
		<>
			<AlertDialog
				open={show}
				onOpenChange={setShow}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn không??</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn xóa dữ liệu này khỏi máy chủ.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={deleteFn}>Tiếp tục</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			
			<Button variant="ghost" className="h-8 w-8 p-0" asChild>
				<Link href={`/dashboard/users/${item?.id}`}>
					<SquarePen className="h-4 w-4" />
				</Link>
			</Button>
			
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(String(item.id))}
					>
						Copy ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className={'bg-destructive text-destructive-foreground focus:bg-destructive/90 focus:text-white'}
						onClick={()=>setShow(true)}
					>
						<Trash className={'w-4 h-4 mr-2'} /> Xóa
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
export default ActionCol
