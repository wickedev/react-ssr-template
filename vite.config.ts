import react from "@vitejs/plugin-react";
import { defineConfig, UserConfigExport } from "vite";
import relay from "vite-plugin-relay";

const config: UserConfigExport = defineConfig({
  plugins: [react(), relay],
  define: {
    "process.env": process.env,
  },
});

export default config;
