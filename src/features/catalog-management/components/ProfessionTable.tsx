import { Trash2, Plus } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import type { CatalogProfession } from "../types";

interface ProfessionTableProps {
	professions: CatalogProfession[];
	onAddProfession: () => void;
	onDisableProfession: (id: string) => void;
}

export function ProfessionTable({
	professions,
	onAddProfession,
	onDisableProfession,
}: ProfessionTableProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button className="shadow-sm" onClick={onAddProfession}>
					<Plus className="w-4 h-4 mr-2" />
					Add Profession
				</Button>
			</div>

			<Card className="border-border/50 shadow-sm overflow-hidden">
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-muted/30">
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Profession Name
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
							{professions.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={3}
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
										<TableCell className="font-semibold pl-6">
											<div className="flex items-center gap-2">
												{profession.name}
												{!profession.isActive && (
													<Badge
														variant="secondary"
														className="h-4 px-1 text-[9px]"
													>
														Disabled
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>
											<span className="text-xs font-mono text-muted-foreground">
												{profession.slug}
											</span>
										</TableCell>
										<TableCell className="text-right pr-6">
											<Button
												size="sm"
												variant="ghost"
												className={cn(
													"h-8 w-8 p-0 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10",
													profession.isActive
														? "opacity-0 group-hover:opacity-100"
														: "opacity-0 cursor-not-allowed",
												)}
												disabled={!profession.isActive}
												onClick={() => onDisableProfession(profession.id)}
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
