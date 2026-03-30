import { useNavigate } from "@tanstack/react-router";
import { Plus, Search, SortAsc, SortDesc } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/features/user-management/components/Pagination";
import { Route } from "@/routes/_admin-layout/admin-management";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useAdmins } from "../hooks/use-admins";
import type { AdminManagementSearch } from "../validators/admin-management-params";
import { AdminTable } from "./AdminTable";
import { CreateAdminDialog } from "./CreateAdminDialog";

export function AdminManagement() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch() as AdminManagementSearch;
	const { data: adminsData } = useAdmins(searchParams);

	const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const debouncedSearch = useDebounce(searchTerm, 500);

	useEffect(() => {
		setSearchTerm(searchParams.search || "");
	}, [searchParams.search]);

	useEffect(() => {
		if (debouncedSearch !== (searchParams.search || "")) {
			navigate({
				search: (prev) => ({
					...prev,
					search: debouncedSearch || undefined,
					page: 1,
				}),
			});
		}
	}, [debouncedSearch, navigate, searchParams.search]);

	type StatusValue = NonNullable<AdminManagementSearch["status"]> | "all";
	type SortValue = AdminManagementSearch["sort"];

	const parseStatusValue = (value: string): StatusValue =>
		value === "active" || value === "blocked" ? value : "all";

	const parseSortValue = (value: string): SortValue =>
		value === "old" ? "old" : "recent";

	const handleStatusChange = (value: StatusValue) => {
		navigate({
			search: (prev) => ({
				...prev,
				status: value === "all" ? undefined : value,
				page: 1,
			}),
		});
	};

	const handleSortChange = (value: SortValue) => {
		navigate({
			search: (prev) => ({
				...prev,
				sort: value,
				page: 1,
			}),
		});
	};

	if (!adminsData) return null;

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Admin Management
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage admin access and status across the platform.
					</p>
				</div>
				<Button onClick={() => setIsCreateOpen(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Add Admin
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
				<div className="md:col-span-5 relative group">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
					<Input
						placeholder="Search by name or email..."
						className="pl-9 h-10 bg-muted/30 focus-visible:bg-background transition-all"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className="md:col-span-7 flex flex-wrap items-center gap-3 justify-end">
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Status
						</span>
						<Select
							value={searchParams.status || "all"}
							onValueChange={(v) => handleStatusChange(parseStatusValue(v))}
						>
							<SelectTrigger className="w-[140px] h-10">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="blocked">Blocked</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Sort
						</span>
						<Select
							value={searchParams.sort || "recent"}
							onValueChange={(v) => handleSortChange(parseSortValue(v))}
						>
							<SelectTrigger className="w-[140px] h-10">
								<SelectValue placeholder="Sort By" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="recent">
									<div className="flex items-center gap-2">
										<SortDesc className="w-3.5 h-3.5" />
										<span>Recent First</span>
									</div>
								</SelectItem>
								<SelectItem value="old">
									<div className="flex items-center gap-2">
										<SortAsc className="w-3.5 h-3.5" />
										<span>Oldest First</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<AdminTable admins={adminsData.admins} />

			<Pagination
				currentPage={adminsData.page}
				totalPages={adminsData.totalPages}
				totalItems={adminsData.total}
				limit={adminsData.limit}
				onPageChange={(page: number) =>
					navigate({ search: (prev) => ({ ...prev, page }) })
				}
				onLimitChange={(limit: number) =>
					navigate({ search: (prev) => ({ ...prev, limit, page: 1 }) })
				}
			/>

			<CreateAdminDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
		</div>
	);
}
