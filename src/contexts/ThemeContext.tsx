import react from "react";

interface ThemeContextType {
	isDarkMode: boolean;
	toggleTheme: () => void;
	setTheme: (dark: boolean) => void;
}

const ThemeContext = react.createContext<ThemeContextType | undefined>(
	undefined,
);

export const ThemeProvider = ({ children }: { children: react.ReactNode }) => {
	// Initialize state from localStorage
	const [isDarkMode, setIsDarkMode] = react.useState<boolean>(() => {
		return localStorage.getItem("theme") === "dark";
	});

	// Effect to apply the class and save to localStorage
	react.useEffect(() => {
		const root = window.document.documentElement;

		if (isDarkMode) {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDarkMode]);

	const toggleTheme = () => setIsDarkMode((prev) => !prev);

	const setTheme = (dark: boolean) => setIsDarkMode(dark);

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Custom Hook for theme consuption
export const useTheme = () => {
	const context = react.useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
