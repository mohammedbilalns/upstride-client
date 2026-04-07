import { useNavigate } from "@tanstack/react-router";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Route } from "@/routes/_admin-layout/user-management";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Pagination } from "../components/Pagination";
import { UserTable } from "../components/UserTable";
import { useUsers } from "../hooks/use-users";

export function UserManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const { data: usersData } = useUsers(searchParams);

	const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
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

	const handleFilterChange = <K extends keyof typeof searchParams>(
		key: K,
		value: (typeof searchParams)[K] | "all",
	) => {
		navigate({
			search: (prev) => ({
				...prev,
				[key]: value === "all" ? undefined : value,
				page: 1,
			}),
		});
	};

	const handleRoleChange = (value: string) => {
		if (value === "all" || value === "USER" || value === "MENTOR") {
			handleFilterChange("role", value);
		}
	};

	const handleStatusChange = (value: string) => {
		if (value === "all" || value === "active" || value === "blocked") {
			handleFilterChange("status", value);
		}
	};

	const handleSortChange = (value: string) => {
		if (value === "recent" || value === "old") {
			handleFilterChange("sort", value);
		}
	};

	if (!usersData) return null;

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">User Management</h1>
					<p className="text-muted-foreground mt-1">
						Manage platform users, roles, and access status.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
				<div className="md:col-span-4 relative group">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
					<Input
						placeholder="Search by name or email..."
						className="pl-9 h-10 bg-muted/30 focus-visible:bg-background transition-all"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className="md:col-span-8 flex flex-wrap items-center gap-3 justify-end">
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Role
						</span>
						<Select
							value={searchParams.role || "all"}
							onValueChange={handleRoleChange}
						>
							<SelectTrigger className="w-32.5 h-10">
								<SelectValue placeholder="All Roles" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="USER">User</SelectItem>
								<SelectItem value="MENTOR">Mentor</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Status
						</span>
						<Select
							value={searchParams.status || "all"}
							onValueChange={handleStatusChange}
						>
							<SelectTrigger className="w-32.5 h-10">
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
							onValueChange={handleSortChange}
						>
							<SelectTrigger className="w-35 h-10">
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

			<UserTable users={usersData.users} total={usersData.total} />

			<Pagination
				currentPage={usersData.page}
				totalPages={usersData.totalPages}
				totalItems={usersData.total}
				limit={usersData.limit}
				onPageChange={(page: number) =>
					navigate({ search: (prev) => ({ ...prev, page }) })
				}
				onLimitChange={(limit: number) =>
					navigate({ search: (prev) => ({ ...prev, limit, page: 1 }) })
				}
			/>
		</div>
	);
}
