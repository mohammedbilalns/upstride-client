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
import { formatDateShort } from "@/shared/utils/date";
import { useBlockUser } from "../hooks/mutations/useBlockUser";
import { useUnblockUser } from "../hooks/mutations/useUnblockUser";
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
	const [isOpen, setIsOpen] = useState(false);
	const [processing, setProcessing] = useState<{
		userId: string;
		action: "block" | "unblock";
	} | null>(null);

	const blockMutation = useBlockUser();
	const unblockMutation = useUnblockUser();

	const handleActionPreview = (
		user: UserListItem,
		type: "block" | "unblock",
	) => {
		setSelectedUser(user);
		setActionType(type);
		setIsOpen(true);
	};

	const handleAction = async () => {
		if (!selectedUser || !actionType) return;

		const mutation = actionType === "block" ? blockMutation : unblockMutation;

		setProcessing({ userId: selectedUser.id, action: actionType });

		try {
			await mutation.mutateAsync({ userId: selectedUser.id });
			setIsOpen(false);
		} finally {
			setProcessing(null);
		}
	};

	const isProcessing =
		(processing?.action === "block" && blockMutation.isPending) ||
		(processing?.action === "unblock" && unblockMutation.isPending);

	return (
		<div className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<Table>
				<TableHeader className="bg-muted/50">
					<TableRow>
						<TableHead className="w-10 pl-4"></TableHead>
						<TableHead className="w-75 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							User Details
						</TableHead>
						<TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							Role
						</TableHead>
						<TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							Status
						</TableHead>
						<TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							Joined Date
						</TableHead>
						<TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 pr-6">
							Actions
						</TableHead>
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
								<TableCell className="w-10 pl-4" />
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
										{formatDateShort(user.joinedAt)}
									</span>
								</TableCell>
								<TableCell className="text-right">
									{user.status === "active" ? (
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all font-bold text-[11px] rounded-lg gap-2"
											onClick={() => handleActionPreview(user, "block")}
											disabled={processing?.userId === user.id}
										>
											<ShieldAlert className="w-3.5 h-3.5" />
											Block Access
										</Button>
									) : (
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all font-bold text-[11px] rounded-lg gap-2"
											onClick={() => handleActionPreview(user, "unblock")}
											disabled={processing?.userId === user.id}
										>
											<ShieldCheck className="w-3.5 h-3.5" />
											Restore Access
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<ConfirmModal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
					setTimeout(() => {
						setSelectedUser(null);
						setActionType(null);
					}, 200);
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
