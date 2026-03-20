import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
//import { tanstackRouter} from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		tanstackStart(),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		///		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		viteReact(),
	],
	server: {
		port: 3000,
	},
});

export default config;
