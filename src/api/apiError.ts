/**
 * API error response
 */
export interface ApiError extends Error {
	response?: {
		data?: {
			message?: string;
			success?: boolean;
			errors?: { path: string; message: string }[];
		};
		status?: number;
	};
}
