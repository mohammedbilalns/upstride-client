import api from "@/api/axios";
import { ROUTES } from "@/api/routes";

export interface PresignedUrlResponse {
	success: boolean;
	data: {
		url: string;
		fields: Record<string, string>;
		key: string;
	};
}

export const fileService = {
	/**
	 * Gets a presigned URL for uploading a file directly to s3.
	 */
	getPresignedUrl: async (
		fileName: string,
		mimetype: string,
		category:
			| "resume"
			| "profile-picture"
			| "chat-media"
			| "article-featured-image",
	): Promise<PresignedUrlResponse> => {
		const response = await api.post(
			`${ROUTES.STORAGE.BASE}${ROUTES.STORAGE.GET_PRESIGNED_URL}`,
			{
				fileName,
				mimetype,
				category,
			},
		);
		return response.data;
	},

	/**
	 * Uploads a file directly to cloud storage using a presigned URL.
	 */
	//TODO: improve to include the progress of file upload
	uploadFile: async (
		url: string,
		fields: Record<string, string>,
		file: File,
	): Promise<void> => {
		const formData = new FormData();
		Object.entries(fields).forEach(([key, value]) => {
			formData.append(key, value);
		});
		formData.append("file", file);

		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Upload failed with status ${response.status}`);
		}
	},

	/**
	 * Deletes a file from cloud storage.
	 */
	deleteFile: async (key: string): Promise<void> => {
		const response = await api.delete(
			`${ROUTES.STORAGE.BASE}${ROUTES.STORAGE.DELETE}`,
			{
				data: { key },
			},
		);

		if (response.status !== 200) {
			throw new Error("Failed to delete file");
		}
	},

	/**
	 *  method that handles the complete file upload flow:
	 * Gets presigned URL from backend
	 * Uploads file directly to storage
	 * Returns the storage key for reference
	 */
	handleFileUpload: async (
		file: File,
		category:
			| "resume"
			| "profile-picture"
			| "chat-media"
			| "article-featured-image",
	): Promise<string> => {
		const { data } = await fileService.getPresignedUrl(
			file.name,
			file.type,
			category,
		);
		await fileService.uploadFile(data.url, data.fields, file);

		return data.key;
	},
};
