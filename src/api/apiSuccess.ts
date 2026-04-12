export type ApiSuccess<T = undefined> = T extends undefined
	? {
			success: true;
			message: string;
		}
	: {
			success: true;
			message: string;
			data: T;
		};
