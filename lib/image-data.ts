import {ChangeEvent} from "react";

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
	// FileList is immutable, so we need to create a new one
	const dataTransfer = new DataTransfer();

	// Add newly uploaded images
	Array.from(event.target.files!).forEach((image) =>
		dataTransfer.items.add(image)
	);

	const files = dataTransfer.files;
	const displayUrl = URL.createObjectURL(event.target.files![0]);

	return { files, displayUrl };
}

export function uploadFile(file: any) {
	if(!file || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) return

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

	return fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL, {
		method: 'POST',
		body: formData,
		redirect: 'follow'
	})
}
