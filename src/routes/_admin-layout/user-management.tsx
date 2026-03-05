import { createFileRoute } from "@tanstack/react-router";

import { UserManagementSearchSchema } from "@/shared/validators/user-management-params";
import { UserManagement } from "@/features/user-management/components/UserManagement";
import { userManagementQueryOptions } from "@/features/user-management/hooks/use-users";

export const Route = createFileRoute("/_admin-layout/user-management")({
	validateSearch: (search) => UserManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(userManagementQueryOptions(search)),
	component: UserManagement,
});
