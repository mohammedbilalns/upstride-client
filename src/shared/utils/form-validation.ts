type IssueLike = { path: Array<string | number | symbol>; message: string };

export const pathToKey = (path: Array<string | number | symbol>): string =>
	path.reduce((acc: string, segment) => {
		const segmentStr = String(segment);
		if (typeof segment === "number") {
			return `${acc}[${segmentStr}]`;
		}
		if (!acc) return segmentStr;
		return `${acc}.${segmentStr}`;
	}, "");

export const buildFieldErrorsFromIssues = (issues: IssueLike[]) => {
	const fieldErrors: Record<string, string> = {};
	for (const issue of issues) {
		const key = pathToKey(issue.path);
		if (!key || fieldErrors[key]) continue;
		fieldErrors[key] = issue.message;
	}
	return fieldErrors;
};

export const buildEmptyStringErrors = (
	value: unknown,
	path = "",
	errors: Record<string, string> = {},
): Record<string, string> => {
	if (value === "") {
		if (path) {
			errors[path] = "This field is required";
		}
		return errors;
	}

	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			const nextPath = `${path}[${index}]`;
			buildEmptyStringErrors(item, nextPath, errors);
		});
		return errors;
	}

	if (value && typeof value === "object") {
		Object.entries(value).forEach(([key, val]) => {
			const nextPath = path ? `${path}.${key}` : key;
			buildEmptyStringErrors(val, nextPath, errors);
		});
	}

	return errors;
};

export const getErrorMessage = (error: unknown): string | undefined => {
	if (Array.isArray(error)) {
		const first = error[0] as { message?: string } | undefined;
		return first?.message || first?.toString() || undefined;
	}
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error) {
		const message = (error as { message?: unknown }).message;
		return typeof message === "string" ? message : undefined;
	}
	return undefined;
};

export const parseNumberInput = (value: string): number | "" =>
	value === "" ? "" : Number(value);
