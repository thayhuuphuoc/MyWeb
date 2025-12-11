import React, {useEffect, useState, useTransition} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CheckIcon, CopyIcon, TrashIcon} from "@radix-ui/react-icons";
import {Reorder, useDragControls, useMotionValue} from "framer-motion";
import {GripIcon} from "lucide-react";
import {useRaisedShadow} from "@/hooks/use-raised-shadow";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {TRelatedLink} from "@/actions/common/ralated-link-schema";

type Props = {
	data: TRelatedLink[],
	handleChange: (e: TRelatedLink[]) => void
}
export default function RelatedLinksControl(props: Props){
	const [data, setData] = useState(props.data.map((d, index) => ({...d, index: Math.round(Math.random() * 1000)})))
	const [copiedText, copyToClipboard] = useCopyToClipboard();
	const hasCopiedText = Boolean(copiedText);

	useEffect(()=> {
		props.handleChange(data)
	}, [data])

	return (
		<div>
			<div className="flex justify-between ">
				<p>Link liên quan</p>
				<Button
					type={'button'}
					size={'icon'}
					className={cn('w-8 h-8 flex-shrink-0')}
					disabled={hasCopiedText}
					variant={'outline'}
					onClick={()=> {
						const temp: string[] = []
						data.forEach(d => temp.push(d.name, d.url))
						copyToClipboard(temp.join('\r\n'))
					}}
				>
					{hasCopiedText ? <CheckIcon className={'w-4 h-4'}/> : <CopyIcon className={'w-4 h-4'}/>}
				</Button>
			</div>


			<Reorder.Group axis="y" values={data} onReorder={setData} className={'grid gap-2 flex-grow'}>
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
				size={'sm'}
				className={cn('flex-shrink-0 mt-2', {
				})}
				variant={'outline'}
				onClick={()=> {
					setData([...data, {name: '', url: '', index: Math.round(Math.random() * 1000)}])
				}}
			>
				Thêm link
			</Button>
		</div>
	)
}

type ItemProps = {
	item: TRelatedLink,
	index: number,
	data: TRelatedLink[],
	setData: (props: TRelatedLink[]) => void
}
const Item = ({item, index, data, setData}: ItemProps) => {
	const y = useMotionValue(0);
	const boxShadow = useRaisedShadow(y);
	const dragControls = useDragControls();

	const handleInput = async (value: string, key: 'name' | 'url') => {
		const t = [...data]
		const values = value.split('\n').filter(t => t.length > 0)
		if(values.length > 1){
			// populate fields
			const temp: TRelatedLink[] = []
			for (let i = 0; i < Math.floor(values.length/2); i++) {
				temp.push({
					index: Math.round(Math.random() * 1000),
					name: values[i*2] || '',
					url: values[i*2+1] || '',
				})
			}

			setData(t.slice(0, index).concat(temp))
		} else {
			t[index][key] = value
			setData(t)
		}
	}

	return (
		<Reorder.Item
			value={item}
			id={String(item.index)}
			style={{ y }}
			dragListener={false}
			dragControls={dragControls}
			className={'flex flex-col gap-1 my-2'}
		>
			<Textarea rows={2} className={'min-h-0'} value={item.name} onChange={e => handleInput(e.target.value, 'name')} placeholder={'Tên đề'}/>
			<Textarea rows={2} className={'min-h-0'} value={item.url} onChange={e => handleInput(e.target.value, 'url')} placeholder={'Url'}/>
			<div className="flex gap-1">
				<Button
					type={'button'}
					size={'icon'}
					className={'w-8 h-8'}
					variant={'secondary'}
					onClick={()=> {
						const t = [...data]
						t.splice(index, 1)
						setData(t)
					}}
				>
					<TrashIcon className={'size-4'}/>
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

