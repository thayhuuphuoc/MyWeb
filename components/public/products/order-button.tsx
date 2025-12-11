import {Button} from "@/components/ui/button";
import Link from "next/link";
import {BaggageClaimIcon} from "lucide-react";
import * as React from "react";

export default function OrderButton(){
	return (
		<Button variant={'outline-primary'} className={' w-full mt-3 text-base font-bold border-2'} size={'lg'}>
			<Link href={'https://zalo.me/g/qejgzb290'} target={'_blank'} className={'flex w-full text-center justify-center items-center'}>
				<BaggageClaimIcon className={'size-5 mr-2'}/> đặt hàng
			</Link>
		</Button>
	)
}
