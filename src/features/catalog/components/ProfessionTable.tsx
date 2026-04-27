import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
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
import type { CatalogProfession } from "../types";

interface ProfessionTableProps {
	professions: CatalogProfession[];
	onEditProfession: (id: string) => void;
	onAddProfession: () => void;
	onDisableProfession: (id: string) => void;
	onEnableProfession: (id: string) => void;
}

export function ProfessionTable({
	professions,
	onEditProfession,
	onAddProfession,
	onDisableProfession,
	onEnableProfession,
}: ProfessionTableProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button className="shadow-sm" onClick={onAddProfession}>
					<Plus className="w-4 h-4 mr-2" />
					Add Profession
				</Button>
			</div>

			<div className="rounded-md border border-border/50 overflow-hidden bg-background">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow className="hover:bg-transparent">
							<TableHead className="w-10 pl-4"></TableHead>
							<TableHead className="text-xs font-bold uppercase tracking-wider">
								Profession Name
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
						{professions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="text-center py-12 text-muted-foreground font-medium italic"
								>
									No professions added yet.
								</TableCell>
							</TableRow>
						) : (
							professions.map((profession) => (
								<TableRow
									key={profession.id}
									className={cn(
										"group hover:bg-muted/50 transition-colors",
										!profession.isActive && "opacity-60 bg-muted/20",
									)}
								>
									<TableCell className="w-10 pl-4" />
									<TableCell className="font-semibold">
										<div className="flex items-center gap-2">
											{profession.name}
											{!profession.isActive && (
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
											{profession.slug}
										</span>
									</TableCell>
									<TableCell className="text-right pr-6">
										<div className="flex items-center justify-end gap-2">
											<Button
												size="sm"
												variant="ghost"
												className="h-8 w-8 p-0 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 opacity-40 group-hover:opacity-100"
												onClick={() => onEditProfession(profession.id)}
												title="Edit Profession"
											>
												<Pencil className="w-3.5 h-3.5" />
											</Button>
											{profession.isActive ? (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 opacity-40 group-hover:opacity-100"
													onClick={() => onDisableProfession(profession.id)}
													title="Disable Profession"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</Button>
											) : (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 opacity-40 group-hover:opacity-100"
													onClick={() => onEnableProfession(profession.id)}
													title="Enable Profession"
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
			</div>
		</div>
	);
}
