import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Bookmark, Star, User } from "lucide-react";
import type { MentorDiscoveryItem } from "../types";

interface MentorCardProps {
	mentor: MentorDiscoveryItem;
}

export function MentorCard({ mentor }: MentorCardProps) {
	return (
		<Card className="flex flex-col h-full bg-white dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
			<CardHeader className="relative flex flex-row gap-4 items-start pb-4">
				<Button
					variant="outline"
					size="icon"
					className="absolute right-4 top-4 shrink-0 text-zinc-500 h-9 w-9"
				>
					<Bookmark className="h-4 w-4" />
				</Button>
				<Avatar className="h-16 w-16 rounded-xl border object-cover">
					<AvatarImage
						src={mentor.avatar || ""}
						alt={mentor.name}
						className="object-cover"
					/>
					<AvatarFallback className="rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
						{mentor.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-1">
					<CardTitle className="flex justify-between items-start text-lg">
						<span className="line-clamp-1 pr-8">{mentor.name}</span>
						{mentor.avgRating > 0 && (
							<div className="flex items-center gap-1 text-sm bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full font-medium text-amber-600 dark:text-amber-500">
								<Star className="h-3.5 w-3.5 fill-current" />
								<span>{mentor.avgRating.toFixed(1)}</span>
							</div>
						)}
					</CardTitle>
					<CardDescription className="line-clamp-1 text-zinc-600 dark:text-zinc-400">
						{mentor.designation || "Mentor"}
					</CardDescription>
					<div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
						<span>{mentor.yearsOfExperience} years exp.</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 pb-4">
				<p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">
					{mentor.bio}
				</p>
				<div className="flex flex-wrap gap-1.5">
					{mentor.categories.slice(0, 3).map((category) => (
						<Badge
							key={category.id}
							variant="secondary"
							className="font-normal bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-300 pointer-events-none"
						>
							{category.name}
						</Badge>
					))}
					{mentor.categories.length > 3 && (
						<Badge
							variant="secondary"
							className="font-normal bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-300"
						>
							+{mentor.categories.length - 3} more
						</Badge>
					)}
				</div>
			</CardContent>

			<CardFooter className="pt-0">
				<Button className="w-full h-9 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900">
					<User className="h-4 w-4 mr-2" />
					View Profile
				</Button>
			</CardFooter>
		</Card>
	);
}
