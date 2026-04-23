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
import { useBlockAdmin } from "../hooks/mutations/useBlockAdmin";
import { useUnblockAdmin } from "../hooks/mutations/useUnblockAdmin";
import type { AdminListItem } from "../types";

interface AdminTableProps {
	admins: AdminListItem[];
}

export function AdminTable({ admins }: AdminTableProps) {
	const [selectedAdmin, setSelectedAdmin] = useState<AdminListItem | null>(
		null,
	);
	const [actionType, setActionType] = useState<"block" | "unblock" | null>(
		null,
	);
	const [isOpen, setIsOpen] = useState(false);
	const [processing, setProcessing] = useState<{
		adminId: string;
		action: "block" | "unblock";
	} | null>(null);

	const blockMutation = useBlockAdmin();
	const unblockMutation = useUnblockAdmin();

	const handleActionPreview = (
		admin: AdminListItem,
		type: "block" | "unblock",
	) => {
		setSelectedAdmin(admin);
		setActionType(type);
		setIsOpen(true);
	};

	const handleAction = async () => {
		if (!selectedAdmin || !actionType) return;

		const mutation = actionType === "block" ? blockMutation : unblockMutation;

		setProcessing({ adminId: selectedAdmin.id, action: actionType });

		try {
			await mutation.mutateAsync({ adminId: selectedAdmin.id });
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
						<TableHead className="w-[320px] py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							Admin Details
						</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Added Date</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{admins.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-48 text-center text-muted-foreground"
							>
								<div className="flex flex-col items-center gap-2">
									<UserIcon className="w-8 h-8 opacity-20" />
									<p>No admins found matching your criteria.</p>
								</div>
							</TableCell>
						</TableRow>
					) : (
						admins.map((admin) => (
							<TableRow
								key={admin.id}
								className="hover:bg-muted/30 transition-colors"
							>
								<TableCell className="w-10 pl-4" />
								<TableCell className="py-4">
									<div className="flex flex-col">
										<span className="font-semibold text-foreground/90 leading-tight">
											{admin.name}
										</span>
										<span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
											<Mail className="w-3 h-3" />
											{admin.email}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										className={
											admin.status === "active"
												? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
												: "bg-rose-500/15 text-rose-600 border-rose-500/30 hover:bg-rose-500/20"
										}
										variant="outline"
									>
										<span className="flex items-center gap-1.5">
											<span
												className={`h-1.5 w-1.5 rounded-full ${
													admin.status === "active"
														? "bg-emerald-500"
														: "bg-rose-500"
												}`}
											/>
											{admin.status === "active" ? "Active" : "Blocked"}
										</span>
									</Badge>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
										<Calendar className="w-3.5 h-3.5" />
										{formatDateShort(admin.addedAt)}
									</span>
								</TableCell>
								<TableCell className="text-right">
									{admin.status === "active" ? (
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all font-bold text-[11px] rounded-lg gap-2"
											onClick={() => handleActionPreview(admin, "block")}
											disabled={processing?.adminId === admin.id}
										>
											<ShieldAlert className="w-3.5 h-3.5" />
											Block Access
										</Button>
									) : (
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all font-bold text-[11px] rounded-lg gap-2"
											onClick={() => handleActionPreview(admin, "unblock")}
											disabled={processing?.adminId === admin.id}
										>
											<ShieldCheck className="w-3.5 h-3.5" />
											Restore Access
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
					{admins.length > 0 && (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={5}
								className="text-center py-4 text-xs text-muted-foreground bg-muted/10 border-t-0"
							>
								End of list &mdash; {admins.length} record
								{admins.length === 1 ? "" : "s"} shown
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<ConfirmModal
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
					setTimeout(() => {
						setSelectedAdmin(null);
						setActionType(null);
					}, 200);
				}}
				onConfirm={handleAction}
				title={
					actionType === "block"
						? "Restrict Admin Access"
						: "Restore Admin Access"
				}
				message={
					actionType === "block"
						? `Are you sure you want to block ${selectedAdmin?.name}?`
						: `Are you sure you want to unblock ${selectedAdmin?.name}?`
				}
				variant={actionType === "block" ? "destructive" : "green"}
				confirmText={
					isProcessing ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Processing...</span>
						</div>
					) : actionType === "block" ? (
						"Block Admin"
					) : (
						"Unblock Admin"
					)
				}
				isLoading={isProcessing}
			/>
		</div>
	);
}
