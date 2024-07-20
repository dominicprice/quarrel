import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react()],
        define: {
            APP_VERSION: JSON.stringify(env.npm_package_version),
            LICENCE: JSON.stringify(
                fs.readFileSync("./LICENSE", { encoding: "utf-8" }),
            ),
        },
        resolve: {
            alias: {
                "#": "/src",
            },
        },
    };
});
