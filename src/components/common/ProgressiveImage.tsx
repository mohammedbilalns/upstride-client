import * as React from "react";

import { cn } from "@/shared/utils/cn";

interface ProgressiveImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	wrapperClassName?: string;
	skeletonClassName?: string;
	showSkeleton?: boolean;
}

export function ProgressiveImage({
	wrapperClassName,
	skeletonClassName,
	showSkeleton = true,
	className,
	onLoad,
	onError,
	...props
}: ProgressiveImageProps) {
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [hasError, setHasError] = React.useState(false);

	const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
		setIsLoaded(true);
		onLoad?.(event);
	};

	const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
		setHasError(true);
		onError?.(event);
	};

	return (
		<div
			className={cn("relative overflow-hidden", wrapperClassName)}
			aria-busy={!isLoaded && !hasError}
		>
			{showSkeleton && !isLoaded && !hasError && (
				<div
					className={cn(
						"absolute inset-0 image-skeleton pointer-events-none",
						skeletonClassName,
					)}
				/>
			)}
			{!hasError && (
				<img
					{...props}
					onLoad={handleLoad}
					onError={handleError}
					className={cn(
						"transition-opacity duration-300",
						isLoaded ? "opacity-100 image-fade-in" : "opacity-0",
						className,
					)}
				/>
			)}
		</div>
	);
}
