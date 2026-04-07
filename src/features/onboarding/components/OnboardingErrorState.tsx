import { Button } from "@/components/ui/button";

interface OnboardingErrorStateProps {
	onRetry: () => void;
}

export function OnboardingErrorState({ onRetry }: OnboardingErrorStateProps) {
	return (
		<div className="text-center space-y-4 py-8">
			<p className="text-destructive font-medium">Failed to load catalog.</p>
			<Button onClick={onRetry} variant="outline">
				Try again
			</Button>
		</div>
	);
}
