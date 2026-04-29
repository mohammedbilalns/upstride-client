import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton({ isMentor }: { isMentor?: boolean }) {
	return (
		<div className="mx-auto max-w-[90rem] space-y-3 p-2.5 md:p-4 animate-in fade-in duration-500">
			{/* Dashboard Hero Skeleton */}
			<div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-linear-to-br from-card via-card to-muted/30 p-4 md:p-5 shadow-sm">
				<div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex max-w-3xl flex-col gap-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-10 w-64" />
						<Skeleton className="h-4 w-full max-w-xl" />
					</div>
					<div className="grid w-full gap-2 sm:grid-cols-2 lg:max-w-xl lg:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="rounded-2xl border border-border/60 bg-background/70 p-3 shadow-sm"
							>
								<Skeleton className="h-3 w-16" />
								<Skeleton className="mt-1 h-6 w-24" />
								<Skeleton className="mt-1 h-3 w-20" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Middle Row Skeletons */}
			<div className="grid grid-cols-1 items-stretch gap-2.5 xl:grid-cols-[1.2fr_0.8fr]">
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<div className="space-y-1">
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-3 w-48" />
						</div>
						<Skeleton className="h-8 w-20" />
					</CardHeader>
					<CardContent className="space-y-2">
						{[1, 2].map((i) => (
							<div
								key={i}
								className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-3 md:flex-row md:items-center md:justify-between"
							>
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-3 w-20" />
								</div>
								<div className="flex flex-col gap-1.5 md:items-end">
									<Skeleton className="h-5 w-16" />
									<Skeleton className="h-4 w-12" />
									<Skeleton className="h-8 w-16" />
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				<Card className="border-border/60 shadow-sm">
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-16" />
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-16" />
							</div>
						</div>
						<div className="mt-auto pt-4">
							<Skeleton className="h-12 w-full rounded-2xl" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Three Column Grid Skeletons */}
			<div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.15fr_0.95fr_1fr]">
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<div className="space-y-1">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-3 w-40" />
						</div>
						<Skeleton className="h-4 w-24" />
					</CardHeader>
					<CardContent className="space-y-2.5">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex items-start gap-3 rounded-2xl border border-border/60 p-3.5"
							>
								<Skeleton className="h-8 w-8 rounded-xl" />
								<div className="flex-1 space-y-1.5">
									<Skeleton className="h-4 w-full max-w-[120px]" />
									<Skeleton className="h-3 w-full max-w-[180px]" />
								</div>
								<Skeleton className="h-3 w-10" />
							</div>
						))}
					</CardContent>
				</Card>

				<Card className="border-border/60 shadow-sm">
					<CardHeader>
						<Skeleton className="h-6 w-36" />
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-border/60 bg-muted/20">
							<Skeleton className="h-32 w-32 rounded-full" />
						</div>
						<div className="space-y-2">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Skeleton className="h-2.5 w-2.5 rounded-full" />
										<Skeleton className="h-3 w-16" />
									</div>
									<Skeleton className="h-3 w-12" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/60 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-3">
						<div className="space-y-1">
							<Skeleton className="h-6 w-44" />
							<Skeleton className="h-3 w-40" />
						</div>
						<Skeleton className="h-4 w-12" />
					</CardHeader>
					<CardContent className="space-y-2.5">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex items-start gap-3 rounded-2xl border border-border/60 p-3"
							>
								<Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
								<div className="flex-1 space-y-1.5">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-3 w-full" />
									<Skeleton className="h-2.5 w-20" />
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Activity Overview Skeleton */}
			<div className="grid grid-cols-1 gap-2.5">
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between">
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-9 w-48 rounded-full" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-64 w-full rounded-2xl" />
					</CardContent>
				</Card>
			</div>

			{isMentor && (
				<div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.25fr_0.85fr]">
					<Card className="border-border/60 shadow-sm">
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-48 w-full" />
						</CardContent>
					</Card>
					<Card className="border-border/60 shadow-sm">
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-3">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="space-y-2 rounded-2xl border border-border/60 p-4"
								>
									<div className="flex items-center gap-2">
										<Skeleton className="h-8 w-8 rounded-full" />
										<Skeleton className="h-4 w-24" />
									</div>
									<Skeleton className="h-3 w-full" />
									<Skeleton className="h-3 w-3/4" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
