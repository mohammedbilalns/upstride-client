export const buildEmptyStringErrors = (
	value: unknown,
	path: string[] = [],
	errors: Record<string, string> = {},
): Record<string, string> => {
	if (value === "") {
		const key = path.join(".");
		if (key) {
			errors[key] = "This field is required";
		}
		return errors;
	}

	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			buildEmptyStringErrors(item, [...path, String(index)], errors);
		});
		return errors;
	}

	if (value && typeof value === "object") {
		Object.entries(value).forEach(([key, val]) => {
			buildEmptyStringErrors(val, [...path, key], errors);
		});
	}

	return errors;
};
