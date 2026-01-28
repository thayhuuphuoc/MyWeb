"use server";

import {TContactSchema} from "@/schemas/contact.schema";
import {getErrorMessage} from "@/lib/handle-error";
import {sendContact} from "@/lib/mail";

export const actionSendMail = async (input: TContactSchema) => {
	try {
		if (process.env.NODE_ENV === 'development') {
			console.log("[actionSendMail] Received input:", {
				name: input.name,
				phone: input.phone,
				email: input.email,
				hasAddress: !!input.address,
				noteLength: input.note?.length || 0
			});
		}

		const res = await sendContact(input);
		
		if (process.env.NODE_ENV === 'development') {
			console.log("[actionSendMail] Email sent successfully");
		}

		return {
			data: res,
			error: null
		}
	} catch (e) {
		const errorMessage = getErrorMessage(e);
		
		if (process.env.NODE_ENV === 'development') {
			console.error("[actionSendMail] Error:", errorMessage);
			console.error("[actionSendMail] Full error:", e);
		}

		return {
			data: null,
			error: errorMessage,
		}
	}
}
