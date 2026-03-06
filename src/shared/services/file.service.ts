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
	getPresignedUrl: async (
		fileName: string,
		mimetype: string,
		category: "resume" | "profile-picture",
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

	deleteFile: async (key: string): Promise<void> => {
		const response = await api.delete(
			`${ROUTES.STORAGE.BASE}${ROUTES.STORAGE.DELETE_FILE}`,
			{
				data: { key },
			},
		);

		if (response.status !== 200) {
			throw new Error("Failed to delete file");
		}
	},

	handleFileUpload: async (
		file: File,
		category: "resume" | "profile-picture",
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
