import {
	ChevronDown,
	ChevronRight,
	Plus,
	RotateCcw,
	Trash2,
} from "lucide-react";
import { Fragment, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { cn } from "@/shared/utils/cn";
import type { CatalogInterest } from "../types";
import { SkillTable } from "./SkillTable";

interface InterestTableProps {
	interests: CatalogInterest[];
	onAddSkill: (interestId: string) => void;
	onDisableInterest: (id: string) => void;
	onEnableInterest: (id: string) => void;
	onDisableSkill: (id: string) => void;
	onEnableSkill: (id: string) => void;
}

export function InterestTable({
	interests,
	onAddSkill,
	onDisableInterest,
	onEnableInterest,
	onDisableSkill,
	onEnableSkill,
}: InterestTableProps) {
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

	const toggleExpand = (id: string) => {
		const newIds = new Set(expandedIds);
		if (newIds.has(id)) {
			newIds.delete(id);
		} else {
			newIds.add(id);
		}
		setExpandedIds(newIds);
	};

	return (
		<div className="rounded-md border border-border/50 overflow-hidden bg-background">
			<Table>
				<TableHeader className="bg-muted/50">
					<TableRow className="hover:bg-transparent">
						<TableHead className="w-[48px]"></TableHead>
						<TableHead className="w-[300px] text-xs font-bold uppercase tracking-wider">
							Interest Name
						</TableHead>
						<TableHead className="text-xs font-bold uppercase tracking-wider">
							Slug
						</TableHead>
						<TableHead className="text-right pr-6 text-xs font-bold uppercase tracking-wider">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{interests.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className="text-center py-12 text-muted-foreground font-medium italic"
							>
								No interests added yet.
							</TableCell>
						</TableRow>
					) : (
						interests.map((interest) => (
							<Fragment key={interest.id}>
								<TableRow
									className={cn(
										"group transition-colors",
										!interest.isActive && "opacity-60 bg-muted/20",
										expandedIds.has(interest.id) && "bg-muted/30",
									)}
								>
									<TableCell className="pl-4">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0"
											onClick={() => toggleExpand(interest.id)}
										>
											{expandedIds.has(interest.id) ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
										</Button>
									</TableCell>
									<TableCell className="font-semibold">
										<div className="flex items-center gap-2">
											{interest.name}
											<Badge
												variant={interest.isActive ? "default" : "secondary"}
												className="h-4 px-1 text-[9px]"
											>
												{interest.isActive ? "Active" : "Disabled"}
											</Badge>
										</div>
									</TableCell>
									<TableCell>
										<span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
											{interest.slug}
										</span>
									</TableCell>
									<TableCell className="text-right pr-6">
										<div className="flex items-center justify-end gap-2">
											<Button
												size="sm"
												variant="ghost"
												className={cn(
													"h-8 w-8 p-0 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
													interest.isActive
														? "opacity-0 group-hover:opacity-100"
														: "opacity-0 cursor-not-allowed",
												)}
												disabled={!interest.isActive}
												onClick={() => onAddSkill(interest.id)}
												title="Add Skill"
											>
												<Plus className="w-3.5 h-3.5" />
											</Button>
											{interest.isActive ? (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100"
													onClick={() => onDisableInterest(interest.id)}
													title="Disable Interest"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</Button>
											) : (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100"
													onClick={() => onEnableInterest(interest.id)}
													title="Enable Interest"
												>
													<RotateCcw className="w-3.5 h-3.5" />
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
								{expandedIds.has(interest.id) && (
									<TableRow className="hover:bg-transparent bg-muted/10">
										<TableCell colSpan={4} className="p-0 border-b">
											<div className="px-12 py-4 bg-background/50">
												<div className="flex items-center gap-2 mb-3">
													<Badge
														variant="outline"
														className="text-[10px] uppercase font-bold tracking-wider opacity-60"
													>
														Skills for {interest.name}
													</Badge>
												</div>
												<div className="rounded-lg border border-border/40 overflow-hidden shadow-sm">
													<SkillTable
														skills={interest.skills}
														parentActive={interest.isActive}
														onDisableSkill={onDisableSkill}
														onEnableSkill={onEnableSkill}
													/>
												</div>
											</div>
										</TableCell>
									</TableRow>
								)}
							</Fragment>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
