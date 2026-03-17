import { format } from "date-fns";
import {
	Calendar,
	Loader2,
	Mail,
	ShieldAlert,
	ShieldCheck,
	User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useBlockUser, useUnblockUser } from "../hooks/use-user-actions";
import type { UserListItem } from "../types";

interface UserTableProps {
	users: UserListItem[];
	total: number;
}

export function UserTable({ users }: UserTableProps) {
	const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
	const [actionType, setActionType] = useState<"block" | "unblock" | null>(
		null,
	);

	const blockMutation = useBlockUser();
	const unblockMutation = useUnblockUser();

	const handleAction = async () => {
		if (!selectedUser || !actionType) return;

		const mutation = actionType === "block" ? blockMutation : unblockMutation;

		await mutation.mutateAsync(
			{ userId: selectedUser.id },
			{
				onSuccess: () => {
					setSelectedUser(null);
					setActionType(null);
				},
			},
		);
	};

	const isProcessing = blockMutation.isPending || unblockMutation.isPending;

	return (
		<div className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<Table>
				<TableHeader className="bg-muted/50">
					<TableRow>
						<TableHead className="w-[300px] py-4">User Details</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Joined Date</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-48 text-center text-muted-foreground"
							>
								<div className="flex flex-col items-center gap-2">
									<UserIcon className="w-8 h-8 opacity-20" />
									<p>No users found matching your criteria.</p>
								</div>
							</TableCell>
						</TableRow>
					) : (
						users.map((user) => (
							<TableRow
								key={user.id}
								className="hover:bg-muted/30 transition-colors"
							>
								<TableCell className="py-4">
									<div className="flex flex-col">
										<span className="font-semibold text-foreground/90 leading-tight">
											{user.name}
										</span>
										<span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
											<Mail className="w-3 h-3" />
											{user.email}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={`font-medium px-2 py-0.5 rounded-md ${
											user.role === "MENTOR"
												? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
												: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
										}`}
									>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										className={
											user.status === "active"
												? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
												: "bg-rose-500/15 text-rose-600 border-rose-500/30 hover:bg-rose-500/20"
										}
										variant="outline"
									>
										<span className="flex items-center gap-1.5">
											<span
												className={`h-1.5 w-1.5 rounded-full ${
													user.status === "active"
														? "bg-emerald-500"
														: "bg-rose-500"
												}`}
											/>
											{user.status === "active" ? "Active" : "Blocked"}
										</span>
									</Badge>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
										<Calendar className="w-3.5 h-3.5" />
										{format(new Date(user.joinedAt), "MMM dd, yyyy")}
									</span>
								</TableCell>
								<TableCell className="text-right">
									{user.status === "active" ? (
										<Button
											variant="ghost"
											size="sm"
											className="text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all font-semibold"
											onClick={() => {
												setSelectedUser(user);
												setActionType("block");
											}}
											disabled={isProcessing}
										>
											<ShieldAlert className="w-4 h-4 mr-2" />
											Block
										</Button>
									) : (
										<Button
											variant="ghost"
											size="sm"
											className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all font-semibold"
											onClick={() => {
												setSelectedUser(user);
												setActionType("unblock");
											}}
											disabled={isProcessing}
										>
											<ShieldCheck className="w-4 h-4 mr-2" />
											Unblock
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<ConfirmModal
				isOpen={!!selectedUser && !!actionType}
				onClose={() => {
					setSelectedUser(null);
					setActionType(null);
				}}
				onConfirm={handleAction}
				title={
					actionType === "block"
						? "Restrict User Access"
						: "Restore User Access"
				}
				message={
					actionType === "block"
						? `Are you sure you want to block ${selectedUser?.name}?`
						: `Are you sure you want to unblock ${selectedUser?.name}?`
				}
				variant={actionType === "block" ? "destructive" : "green"}
				confirmText={
					isProcessing ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Processing...</span>
						</div>
					) : actionType === "block" ? (
						"Block User"
					) : (
						"Unblock User"
					)
				}
				isLoading={isProcessing}
			/>
		</div>
	);
}
