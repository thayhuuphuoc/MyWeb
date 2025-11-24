"use server";

import {TContactSchema} from "@/schemas/contact.schema";
import {getErrorMessage} from "@/lib/handle-error";
import {sendContact} from "@/lib/mail";

export const actionSendMail = async (input: TContactSchema) => {
	try {
		const res = await sendContact(input)
		return {
			data: res,
			error: null
		}
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}

