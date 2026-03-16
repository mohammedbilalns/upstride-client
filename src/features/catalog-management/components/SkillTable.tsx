import { Trash2, RotateCcw } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import type { CatalogSkill } from "../types";

interface SkillTableProps {
	skills: CatalogSkill[];
	parentActive: boolean;
	onDisableSkill: (id: string) => void;
	onEnableSkill: (id: string) => void;
}

export function SkillTable({
	skills,
	parentActive,
	onDisableSkill,
	onEnableSkill,
}: SkillTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					<TableHead className="w-[300px] pl-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Skill Name
					</TableHead>
					<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Slug
					</TableHead>
					<TableHead className="text-right pr-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Actions
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{skills.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={3}
							className="text-center py-12 text-muted-foreground font-medium italic"
						>
							No skills added yet. Use the "Add Skill" button to get started.
						</TableCell>
					</TableRow>
				) : (
					skills.map((skill) => (
						<TableRow
							key={skill.id}
							className={cn(
								"group hover:bg-muted/50 transition-colors",
								!skill.isActive && "opacity-60 bg-muted/20",
							)}
						>
							<TableCell className="font-semibold pl-6">
								<div className="flex items-center gap-2">
									{skill.name}
									{!skill.isActive && (
										<Badge variant="secondary" className="h-4 px-1 text-[9px]">
											Disabled
										</Badge>
									)}
								</div>
							</TableCell>
							<TableCell>
								<span className="text-xs font-mono text-muted-foreground">
									{skill.slug}
								</span>
							</TableCell>
							<TableCell className="text-right pr-6">
								{skill.isActive ? (
									<Button
										size="sm"
										variant="ghost"
										className={cn(
											"h-8 w-8 p-0 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10",
											parentActive
												? "opacity-0 group-hover:opacity-100"
												: "opacity-0 cursor-not-allowed",
										)}
										disabled={!parentActive}
										onClick={() => onDisableSkill(skill.id)}
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								) : (
									<Button
										size="sm"
										variant="ghost"
										className={cn(
											"h-8 w-8 p-0 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
											parentActive
												? "opacity-0 group-hover:opacity-100"
												: "opacity-50 cursor-not-allowed",
										)}
										disabled={!parentActive}
										onClick={() => onEnableSkill(skill.id)}
										title={
											!parentActive
												? "Parent interest must be enabled first"
												: "Enable Skill"
										}
									>
										<RotateCcw className="w-3.5 h-3.5" />
									</Button>
								)}
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
