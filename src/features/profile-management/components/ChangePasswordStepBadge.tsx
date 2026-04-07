interface ChangePasswordStepBadgeProps {
	active: boolean;
	stepNumber: number;
}

export function ChangePasswordStepBadge({
	active,
	stepNumber,
}: ChangePasswordStepBadgeProps) {
	return (
		<div
			className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
				active
					? "bg-primary text-primary-foreground"
					: "bg-muted text-muted-foreground"
			}`}
		>
			{stepNumber}
		</div>
	);
}
