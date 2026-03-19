type IssueLike = { path: Array<string | number>; message: string };

export const pathToKey = (path: Array<string | number>) =>
	path.reduce((acc, segment) => {
		if (typeof segment === "number") {
			return `${acc}[${segment}]`;
		}
		if (!acc) return segment;
		return `${acc}.${segment}`;
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
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error) {
		const message = (error as { message?: unknown }).message;
		return typeof message === "string" ? message : undefined;
	}
	return undefined;
};
