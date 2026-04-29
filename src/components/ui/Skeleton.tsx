import { cn } from "@/shared/utils/cn";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("image-skeleton rounded-md", className)} {...props} />
	);
}

export { Skeleton };
