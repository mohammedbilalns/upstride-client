import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminManagement } from "@/features/admin-management/components/AdminManagement";
import { adminManagementQueryOptions } from "@/features/admin-management/hooks/use-admins";
import { AdminManagementSearchSchema } from "@/features/admin-management/validators/admin-management-params";

export const Route = createFileRoute("/_admin-layout/admin-management")({
	beforeLoad: async ({ context }) => {
		if (context.auth.user?.role !== "SUPER_ADMIN") {
			throw redirect({ to: "/home" });
		}
	},
	validateSearch: (search) => AdminManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(adminManagementQueryOptions(search)),
	component: AdminManagement,
});
