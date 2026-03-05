import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import type { RegisterPayload } from "../validators/register.schema";

interface UseRegisterOptions {
	onSuccess: (email: string) => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
}

export const useRegister = ({ onSuccess, onError }: UseRegisterOptions) => {
	return useMutation({
		mutationFn: (data: RegisterPayload) => authService.register(data),
		onSuccess: (response, variables) => {
			toast.success(
				response.message ||
					"Registration successful! Please verify your email.",
			);
			onSuccess(variables.email);
		},
		onError: (error) => {
			console.error("Registration error:", error);
			onError?.(error);
		},
	});
};
