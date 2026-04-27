import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminManagementQueryOptions } from "@/features/admin/hooks/queries/useAdmins";
import { AdminManagementPage } from "@/features/admin/pages/AdminManagementPage";
import {
	type AdminManagementSearch,
	AdminManagementSearchSchema,
} from "@/features/admin/validators/admin-management-params.schema";

export const Route = createFileRoute("/_admin-layout/admin-management")({
	beforeLoad: async ({ context }) => {
		if (context.auth.user?.role !== "SUPER_ADMIN") {
			throw redirect({ to: "/home" });
		}
	},
	validateSearch: (search) => AdminManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(
			adminManagementQueryOptions(search as AdminManagementSearch),
		),
	component: AdminManagementPage,
});
