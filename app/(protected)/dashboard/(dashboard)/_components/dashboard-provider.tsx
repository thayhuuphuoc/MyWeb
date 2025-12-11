'use client'

import React, {createContext, useContext, useState} from "react";

export type TNewOrderInfo = {
	id: string,
	order_code: string,
	total: string,
	customer_phone: string,
}

type TDashboardValues = {
	chatRoom: string | undefined
	setChatRoom: React.Dispatch<React.SetStateAction<string | undefined>>
	newOrder: TNewOrderInfo
	setNewOrder: React.Dispatch<React.SetStateAction<TNewOrderInfo>>
}

const initValues: TDashboardValues = {
	chatRoom: 'new-order',
	setChatRoom: () => undefined,
	newOrder: {
		id: '',
		order_code: '',
		total: '',
		customer_phone: '',
	},
	setNewOrder: () => undefined
}

const DashboardContext = createContext(initValues)

export const DashboardProvider = (props: {children: React.ReactNode}) => {
	const [chatRoom, setChatRoom] = useState(initValues.chatRoom)
	const [newOrder, setNewOrder] = useState<TNewOrderInfo>(initValues.newOrder)
	
	return <DashboardContext.Provider value={{
		chatRoom,
		setChatRoom,
		newOrder,
		setNewOrder,
	}}>{props.children}</DashboardContext.Provider>
}

export const useDashboardContext = () => {
	return useContext(DashboardContext)
}
