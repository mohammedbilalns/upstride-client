import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { router } from "@/app/router/routerConfig";
import { authService } from "@/features/authentication/services/auth.service";
import type { AuthenticatedUser } from "@/features/authentication/types";

interface AuthState {
	user: AuthenticatedUser | null;
	isAuthenticated: boolean;
	accessToken: string | null;
}

interface AuthContextType extends AuthState {
	setUser: (user: AuthenticatedUser | null) => void;
	setAuthenticated: (isAuthenticated: boolean) => void;
	setAccessToken: (token: string | null) => void;
	logout: () => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<AuthenticatedUser | null>(null);
	const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	/**
	 * Update the router context with current auth state
	 */
	const updateRouterContext = useCallback((state: AuthState) => {
		router.update({
			context: {
				...router.options.context,
				auth: state,
			},
		});
	}, []);

	/**
	 * Attempts to refresh the token and fetch user data
	 */
	useEffect(() => {
		const initAuth = async () => {
			try {
				const refreshResponse = await authService.refreshToken();
				const token = refreshResponse.data.accessToken;

				// Set initial authenticated state
				const newState: AuthState = {
					user: null,
					isAuthenticated: true,
					accessToken: token,
				};

				updateRouterContext(newState);
				setAccessToken(token);
				setAuthenticated(true);

				// Fetch user data with the new token
				const meResponse = await authService.getMe();
				const userData = meResponse.data.user;

				// Update state with fetched user
				const finalState: AuthState = {
					user: userData,
					isAuthenticated: true,
					accessToken: token,
				};

				setUser(userData);
				updateRouterContext(finalState);
			} catch (error) {
				// Token refresh failed - user is not authenticated
				console.error("Failed to initialize auth session:", error);
				const unauthState: AuthState = {
					user: null,
					isAuthenticated: false,
					accessToken: null,
				};
				updateRouterContext(unauthState);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, [updateRouterContext]);

	/**
	 * Logout function to clear authentication state
	 */
	const logout = async () => {
		try {
			await authService.logout();
		} finally {
			setUser(null);
			setAuthenticated(false);
			setAccessToken(null);
			updateRouterContext({
				user: null,
				isAuthenticated: false,
				accessToken: null,
			});
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				accessToken,
				setUser,
				setAuthenticated,
				setAccessToken,
				logout,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

/**
 * Hook to access authentication context
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
