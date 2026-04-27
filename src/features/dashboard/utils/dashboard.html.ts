export function stripHtmlTags(value: string) {
	if (!value) return "";

	if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
		const parser = new DOMParser();
		const doc = parser.parseFromString(value, "text/html");
		return doc.body.textContent?.trim() ?? "";
	}

	return value
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}
