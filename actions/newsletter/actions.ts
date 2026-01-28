"use server";

import { NewsletterSchema, TNewsletterSchema } from "./validations";
import { getErrorMessage } from "@/lib/handle-error";

/**
 * Subscribe email to Mailchimp audience
 * @param input - Email address to subscribe
 * @returns Success or error message
 */
export async function subscribeNewsletter(input: TNewsletterSchema) {
	try {
		// Validate input
		const validatedData = NewsletterSchema.parse(input);

		// Get Mailchimp configuration from environment variables
		const apiKey = process.env.MAILCHIMP_API_KEY;
		const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., "us1", "us2", etc.
		const audienceId = process.env.MAILCHIMP_AUDIENCE_ID; // List/Audience ID

		if (!apiKey || !serverPrefix || !audienceId) {
			const missingConfig: string[] = [];
			if (!apiKey) missingConfig.push("MAILCHIMP_API_KEY");
			if (!serverPrefix) missingConfig.push("MAILCHIMP_SERVER_PREFIX");
			if (!audienceId) missingConfig.push("MAILCHIMP_AUDIENCE_ID");

			if (process.env.NODE_ENV === "development") {
				console.error("[Newsletter] Missing Mailchimp configuration:", missingConfig);
			}

			return {
				data: null,
				error: "Cấu hình Mailchimp chưa được thiết lập. Vui lòng liên hệ quản trị viên.",
			};
		}

		// Validate API key format (should contain server prefix)
		if (!apiKey.includes('-')) {
			if (process.env.NODE_ENV === "development") {
				console.error("[Newsletter] Invalid API key format. API key should contain server prefix (e.g., 'abc123-us1')");
			}
		}

		// Mailchimp API endpoint - Use PUT to upsert (create or update)
		// Generate MD5 hash of email for PUT endpoint
		const crypto = await import("crypto");
		const emailHash = crypto.createHash("md5").update(validatedData.email.toLowerCase()).digest("hex");
		const apiUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${emailHash}`;

		// Prepare request body
		const requestBody = {
			email_address: validatedData.email,
			status: "subscribed", // or "pending" if you want double opt-in
			status_if_new: "subscribed",
		};

		// Mailchimp uses Basic Auth: username can be any string, password is the API key
		const authString = Buffer.from(`anystring:${apiKey}`).toString("base64");

		// Log request details in development
		if (process.env.NODE_ENV === "development") {
			console.log("[Newsletter] Mailchimp API URL:", apiUrl);
			console.log("[Newsletter] Email hash:", emailHash);
			console.log("[Newsletter] Request body:", JSON.stringify(requestBody, null, 2));
		}

		// Use PUT method to upsert (create or update) member
		const response = await fetch(apiUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${authString}`,
			},
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();

		// Log response in development
		if (process.env.NODE_ENV === "development") {
			console.log("[Newsletter] Response status:", response.status);
			console.log("[Newsletter] Response data:", JSON.stringify(data, null, 2));
		}

		if (!response.ok) {
			// Handle specific Mailchimp errors
			if (data.title === "Member Exists" || data.title === "Invalid Resource") {
				// Check if it's because member already exists
				if (data.detail?.includes("already exists") || data.detail?.includes("Member Exists")) {
					return {
						data: null,
						error: "Email này đã được đăng ký trước đó.",
					};
				}
			}

			// Log full error in development
			if (process.env.NODE_ENV === "development") {
				console.error("[Newsletter] Mailchimp API Error:", {
					status: response.status,
					statusText: response.statusText,
					title: data.title,
					detail: data.detail,
					fullResponse: data,
				});
			}

			return {
				data: null,
				error: data.detail || data.title || `Đăng ký thất bại (${response.status}). Vui lòng thử lại sau.`,
			};
		}

		return {
			data: {
				email: validatedData.email,
				status: data.status,
			},
			error: null,
		};
	} catch (e) {
		// Handle validation errors
		if (e instanceof Error && e.name === "ZodError") {
			return {
				data: null,
				error: "Email không hợp lệ.",
			};
		}

		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

