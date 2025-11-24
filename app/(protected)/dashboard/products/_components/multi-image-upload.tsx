import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useEffect, useState, useTransition} from "react";
import {Input} from "@/components/ui/input";
import {getImageData, uploadFile} from "@/lib/image-data";
import {ACCEPTED_IMAGE_TYPES} from "@/enum/enums";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TrashIcon} from "@radix-ui/react-icons";
import {Reorder, useDragControls, useMotionValue} from "framer-motion";
import {GripIcon} from "lucide-react";
import {useRaisedShadow} from "@/hooks/use-raised-shadow";
import {cn} from "@/lib/utils";
import {TImage} from "@/actions/products/validations";

type Props = {
	images: TImage[],
	handleChange: (e: TImage[]) => void
}
export default function MultiImageUpload(props: Props){
	const [data, setData] = useState(props.images.map((d, index) => ({...d, index: Math.round(Math.random() * 1000000)})))

	useEffect(()=> {
		props.handleChange(data)
	}, [data])

	return (
		<>
			<FormItem className={'flex flex-col md:flex-row md:gap-5'}>
				<FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
					Ảnh sản phẩm
				</FormLabel>
				<div className="w-full md:flex justify-between">
					<Reorder.Group  axis="y" values={data} onReorder={setData} className={'grid gap-2 flex-grow'}>
						{data.map((d, index) => (
							<Item
								key={d.index}
								item={d}
								index={index}
								data={data}
								setData={setData}
							/>
						))}
					</Reorder.Group>
					<Button
						type={'button'}
						className={cn('flex-shrink-0', {
						})}
						variant={'secondary'}
						onClick={()=> {
							setData([...data, {url: '', index: Math.round(Math.random() * 1000000)}])
						}}
					>
						Thêm ảnh
					</Button>
				</div>
			</FormItem>
		</>
	)
}

type ItemProps = {
	item: TImage,
	index: number,
	data: TImage[],
	setData: (props: TImage[]) => void
}
const Item = ({item, index, data, setData}: ItemProps) => {
	const [isPending, startTransition] = useTransition();

	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);
	const dragControls = useDragControls();

	const handleInput = async (event: { target: { files: any; }}) => {
		startTransition(async () => {
			const resImage = await uploadFile(event.target.files![0])
			const d = await resImage?.json();

			const t = [...data]
			t[index].url = String(d?.secure_url)
			setData(t)
		})
	}

	return (
		<Reorder.Item
			value={item}
			id={String(item.index)}
			style={{ boxShadow, y }}
			dragListener={false}
			dragControls={dragControls}
			className={'p-2 rounded-md flex gap-2 bg-white'}
		>
			{Boolean(item.url) ? (
				<Avatar className="w-24 h-24 rounded-none select-none">
					<AvatarImage src={item.url || ""} />
				</Avatar>
			) : (
				<Input
					className={'block'}
					type="file"
					accept={ACCEPTED_IMAGE_TYPES.join(',')}
					onChange={e => handleInput(e)}
					disabled={isPending}
				/>
			)}
			<div className="flex gap-1">
				<Button
					type={'button'}
					size={'sm'}
					className={'grow-0'}
					variant={'secondary'}
					onClick={()=> {
						const t = [...data]
						t.splice(index, 1)
						setData(t)
					}}
				>
					<TrashIcon className={'size-4 mr-1'}/> Xóa
				</Button>
				<Button
					type={'button'}
					size={'icon'}
					variant={'secondary'}
					className={'cursor-grab w-8 h-8'}
					onPointerDown={(event) => dragControls.start(event)}
				>
					<GripIcon
						className={'size-4'}
					/>
				</Button>

			</div>
		</Reorder.Item>
	)
}

