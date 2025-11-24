import Link from "next/link";

export default function Page(){
	return (
		<div className={'min-h-[50vh]'}>
			<article className="container grid grid-cols-1 justify-start gap-8">
				<div className="w-full max-w-3xl grid grid-cols-1 gap-7 px-5">
					<h1 className="text-2xl md:text-6xl font-bold m-0 leading-tight">Liên hệ</h1>
					<hr className="gradient-line"/>
				</div>

				<div className="px-5 prose max-w-3xl w-full">
					<p>Hãy liên hệ với tôi, với những cách sau::</p>
					<ul>
						<li><p>gửi email qua <strong>vinhnguyenhubt@gmail.com</strong></p></li>
						<li><p>nhắn qua zalo <strong>0979 788 685</strong></p></li>
						<li><p>nhắn qua facebook <Link href={'https://www.facebook.com/vinhstinghubt/'} target={'_blank'}>Nguyễn Tuấn Vinh</Link></p></li>
					</ul>
				</div>
			</article>
		</div>
	)
}
