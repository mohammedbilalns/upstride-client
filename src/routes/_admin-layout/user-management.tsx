import { createFileRoute } from "@tanstack/react-router";
import { userManagementQueryOptions } from "@/features/user-management/hooks/use-users";
import { UserManagementPage } from "@/features/user-management/pages/UserManagementPage";
import { UserManagementSearchSchema } from "@/features/user-management/validators/user-management-params";

export const Route = createFileRoute("/_admin-layout/user-management")({
	validateSearch: (search) => UserManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(userManagementQueryOptions(search)),
	component: UserManagementPage,
});
