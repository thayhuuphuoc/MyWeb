import {getDashboardData} from "@/actions/dashboard/queries";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import React from "react";
import {getDateVn} from "@/lib/date";
import {getStatusText} from "@/enum/enums";
import {PostStatus} from ".prisma/client";
import {Button} from "@/components/ui/button";
import {ArrowUpRightIcon, ExternalLink, PencilIcon, SquarePen} from "lucide-react";
import Image from "next/image";

export default function Dashboard(props: {
	dashboardPromise: ReturnType<typeof getDashboardData>
}){
	const {data, error} = React.use(props.dashboardPromise)

	if(!data || error) return <div className={'container'}>Không có dữ liệu</div>

	const {posts, products, totalPosts, totalProducts, totalUsers} = data

	return (
		<>
			<div className="container">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Tổng số bài viết</CardTitle>
							<CardDescription>Tổng số bài đăng trên website</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-4xl font-bold">{totalPosts}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Người dùng <Link href={'/dashboard/users'}><ArrowUpRightIcon className={'size-4 inline mb-0.5'}/></Link></CardTitle>
							<CardDescription>Số lượng người dùng trên website</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-4xl font-bold">{totalUsers}</div>
						</CardContent>
					</Card>
				</div>
				<div className="grid grid-cols-1 gap-4">
					<div className="mt-4">
						<Card>
							<CardHeader>
								<CardTitle>Bài viết mới nhất <Link href={'/dashboard/posts'}><ArrowUpRightIcon className={'size-4 inline mb-0.5'}/></Link></CardTitle>
								<CardDescription>Các bài đăng mới nhất</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead></TableHead>
											<TableHead>Tiêu đề</TableHead>
											<TableHead>Ngày</TableHead>
											<TableHead>Trạng thái</TableHead>
											<TableHead></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{posts.map(post => (
											<TableRow key={post.slug}>
												<TableCell>
													<div className={'w-20 aspect-square relative'}>
														<Image
															src={post.image || "/images/image-default.jpg"}
															alt={post.title || ""}
															width={300} height={300}
															className={'object-cover object-center w-full h-full'}
														/>
													</div>
												</TableCell>
												<TableCell>
													{Boolean(post.status === PostStatus.PUBLISHED) ? (
														<Link href={`/blog/${post.slug}`} target={'_blank'} className="font-medium line-clamp-2" prefetch={false}>
															{post.title}
														</Link>
													):(
														<div className="font-medium line-clamp-2">{post.title}</div>
													)}
												</TableCell>
												<TableCell>{getDateVn(post.createdAt, true)}</TableCell>
												<TableCell>
													{getStatusText(post.status)}
												</TableCell>
												<TableCell>
													<Button variant="ghost" className="h-8 w-8 p-0" asChild>
														<Link href={`/dashboard/posts/${post?.id}`}>
															<SquarePen className="h-4 w-4" />
														</Link>
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	)
}
