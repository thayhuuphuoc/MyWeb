"use client"

import * as React from "react"

import { dataTableConfig, type DataTableConfig } from "@/config/data-table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {DateRangePicker} from "@/components/date-range-picker";
import {TShortPostConstant} from "@/actions/posts/queries";

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"]
type PostConstants = {
	categories: TShortPostConstant[],
	tags: TShortPostConstant[]
}

interface PostsTableContextProps {
	featureFlags: FeatureFlagValue[]
	setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>
	constants: PostConstants,
	setConstants: React.Dispatch<React.SetStateAction<PostConstants>>,
}

const PostsTableContext = React.createContext<PostsTableContextProps>({
	featureFlags: [],
	setFeatureFlags: () => {},
	constants: {
		categories: [],
		tags: []
	},
	setConstants: () => {}
})

export function usePostsTable() {
	const context = React.useContext(PostsTableContext)
	if (!context) {
		throw new Error("usePostsTable must be used within a PostsTableProvider")
	}
	return context
}

export function PostTableProvider({ children }: React.PropsWithChildren) {
	const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagValue[]>([])
	const [constants, setConstants] = React.useState<PostConstants>({
		categories: [],
		tags: []
	})

	return (
		<PostsTableContext.Provider
			value={{
				featureFlags,
				setFeatureFlags,
				constants,
				setConstants
			}}
		>
			<div className="w-full overflow-x-auto flex items-center justify-between mb-1">
				<ToggleGroup
					type="multiple"
					variant="outline"
					size="sm"
					value={featureFlags}
					onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}
					className="w-fit"
				>
					{dataTableConfig.featureFlags.map((flag) => (
						<Tooltip key={flag.value} delayDuration={250}>
							<ToggleGroupItem
								value={flag.value}
								className="whitespace-nowrap px-3 text-xs"
								asChild
							>
								<TooltipTrigger>
									<flag.icon
										className="mr-2 size-3.5 shrink-0"
										aria-hidden="true"
									/>
									{flag.label}
								</TooltipTrigger>
							</ToggleGroupItem>
							<TooltipContent
								align="start"
								side="bottom"
								sideOffset={6}
								className="flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground"
							>
								<div>{flag.tooltipTitle}</div>
								<div className="text-xs text-muted-foreground">
									{flag.tooltipDescription}
								</div>
							</TooltipContent>
						</Tooltip>
					))}
				</ToggleGroup>
				<DateRangePicker
					triggerSize="sm"
					triggerClassName="ml-auto w-56 sm:w-60"
					align="end"
				/>
			</div>
			{children}
		</PostsTableContext.Provider>
	)
}
