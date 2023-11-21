import react from "@vitejs/plugin-react-swc";
import { URL, fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, "./src/.env", "");

  return defineConfig({
    envDir: "./src/.env",
    define: {
      "process.env": env,
    },
    server: {
      host: true,
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    plugins: [react({ plugins: [["@swc/plugin-styled-components", {}]] }), svgr()],
    resolve: {
      alias: {
        src: fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      outDir: "build",
    },
    base: "./",
  });
};
