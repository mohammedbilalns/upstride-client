import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../../services/auth.service";
import type { RegisterFormValues } from "../../validators/register.schema";

interface UseRegisterOptions {
	onSuccess: (email: string) => void;
	onError?: (error: ApiError) => void;
}

export const useRegister = ({ onSuccess, onError }: UseRegisterOptions) => {
	return useMutation({
		mutationFn: (data: Omit<RegisterFormValues, "confirmPassword">) =>
			authService.register(data),
		onSuccess: (response, variables) => {
			toast.success(
				response.message ||
					"Registration successful! Please verify your email.",
			);
			onSuccess(variables.email);
		},
		onError: (error: ApiError) => {
			console.error("Registration error:", error);
			onError?.(error);
		},
	});
};
