import type React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface StatusViewProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	showEditButton?: boolean;
	onEdit?: () => void;
	showResubmitButton?: boolean;
	onResubmit?: () => void;
}

export function StatusView({
	title,
	description,
	icon,
	showEditButton,
	onEdit,
	showResubmitButton,
	onResubmit,
}: StatusViewProps) {
	return (
		<Card className="mx-auto max-w-2xl border-none shadow-xl bg-linear-to-b from-card to-card/50">
			<CardHeader className="text-center pt-10">
				<div className="flex justify-center mb-4">{icon}</div>
				<CardTitle className="text-3xl font-bold">{title}</CardTitle>
				<CardDescription className="text-base mt-2 max-w-md mx-auto">
					{description}
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex justify-center pb-10 gap-4">
				{showEditButton && (
					<Button
						onClick={onEdit}
						variant="outline"
						className="min-w-35 rounded-full"
					>
						Edit Application
					</Button>
				)}
				{showResubmitButton && (
					<Button
						onClick={onResubmit}
						className="min-w-35 rounded-full shadow-lg shadow-primary/25"
					>
						Resubmit Application
					</Button>
				)}
				{!showEditButton && !showResubmitButton && (
					<Button variant="outline" asChild className="rounded-full">
						<a href="/home">Go to Home</a>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
