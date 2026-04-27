import { Pencil, RotateCcw, Trash2 } from "lucide-react";
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
import type { CatalogSkill } from "../types";

interface SkillTableProps {
	skills: CatalogSkill[];
	parentActive: boolean;
	onEditSkill: (id: string) => void;
	onDisableSkill: (id: string) => void;
	onEnableSkill: (id: string) => void;
}

export function SkillTable({
	skills,
	parentActive,
	onEditSkill,
	onDisableSkill,
	onEnableSkill,
}: SkillTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					<TableHead className="w-10 pl-4"></TableHead>
					<TableHead className="w-[300px] text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
							colSpan={4}
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
							<TableCell className="w-10 pl-4" />
							<TableCell className="font-semibold">
								<div className="flex items-center gap-2">
									{skill.name}
									{!skill.isActive && (
										<Badge
											variant="outline"
											className="bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20 h-5 px-2 text-[10px]"
										>
											Disabled
										</Badge>
									)}
								</div>
							</TableCell>
							<TableCell>
								<span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
									{skill.slug}
								</span>
							</TableCell>
							<TableCell className="text-right pr-6">
								<div className="flex items-center justify-end gap-2">
									<Button
										size="sm"
										variant="ghost"
										className="h-8 w-8 p-0 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 opacity-40 group-hover:opacity-100"
										onClick={() => onEditSkill(skill.id)}
										title="Edit Skill"
									>
										<Pencil className="w-3.5 h-3.5" />
									</Button>
									{skill.isActive ? (
										<Button
											size="sm"
											variant="ghost"
											className={cn(
												"h-8 w-8 p-0 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10",
												parentActive
													? "opacity-40 group-hover:opacity-100"
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
													? "opacity-40 group-hover:opacity-100"
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
								</div>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
