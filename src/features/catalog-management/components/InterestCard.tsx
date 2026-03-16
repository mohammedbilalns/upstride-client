import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import { SkillTable } from "./SkillTable";
import type { CatalogInterest } from "../types";

interface InterestCardProps {
	interest: CatalogInterest;
	onAddSkill: (interestId: string) => void;
	onDisableInterest: (id: string) => void;
	onDisableSkill: (id: string) => void;
}

export function InterestCard({
	interest,
	onAddSkill,
	onDisableInterest,
	onDisableSkill,
}: InterestCardProps) {
	return (
		<Card
			className={cn(
				"overflow-hidden border-border/50 shadow-sm transition-all",
				!interest.isActive
					? "opacity-80 bg-muted/50"
					: "hover:shadow-md hover:border-primary/20",
			)}
		>
			<CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0 py-4 border-b">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<CardTitle className="text-lg font-bold">{interest.name}</CardTitle>
						<Badge
							variant={interest.isActive ? "default" : "secondary"}
							className="h-5 px-1.5 text-[10px]"
						>
							{interest.isActive ? "Active" : "Disabled"}
						</Badge>
					</div>
					<span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded w-fit">
						{interest.slug}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="secondary"
						className="h-8"
						disabled={!interest.isActive}
						onClick={() => onAddSkill(interest.id)}
					>
						<Plus className="w-3.5 h-3.5 mr-1" />
						Add Skill
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
						disabled={!interest.isActive}
						onClick={() => onDisableInterest(interest.id)}
					>
						<Trash2 className="w-3.5 h-3.5" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<SkillTable
					skills={interest.skills}
					parentActive={interest.isActive}
					onDisableSkill={onDisableSkill}
				/>
			</CardContent>
		</Card>
	);
}
