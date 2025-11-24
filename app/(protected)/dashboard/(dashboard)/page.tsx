import PageHeading from "@/components/dashboard/page-heading";
import {getDateVn} from "@/lib/date";
import {DashboardProvider} from "@/app/(protected)/dashboard/(dashboard)/_components/dashboard-provider";
import React from "react";
import {getDashboardData} from "@/actions/dashboard/queries";
import Dashboard from "@/app/(protected)/dashboard/(dashboard)/_components/dashboard";

export default function Page(){
	const dashboardPromise = getDashboardData()

	return (
		<>
			<PageHeading
				title={'Xin chào!'}
				description={getDateVn(new Date())}
			/>
			<DashboardProvider>
				<React.Suspense fallback={<div className={'container'}>Loading</div>}>
					<Dashboard dashboardPromise={dashboardPromise}/>
				</React.Suspense>
			</DashboardProvider>
		</>
	)
}
