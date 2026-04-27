export default function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return (
		<p className="text-xs text-red-500/90 dark:text-red-400 mt-1">{message}</p>
	);
}
