import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import * as pagefind from "pagefind";
import path from "node:path";

export default function pagefindIntegration(): AstroIntegration {
    return {
        name: "pagefind",
        hooks: {
            "astro:build:done": async ({ dir }) => {
                const outDir = fileURLToPath(dir);

                // Create the index
                const createResult = await pagefind.createIndex({ verbose: true });

                const index = createResult.index;
                if (!index || createResult.errors.length) {
                    console.error(createResult.errors.join("\n"));
                    return;
                }

                // Parse the content
                const indexResult = await index.addDirectory({
                    path: outDir,
                    glob: "posts/**/*.{html}",
                });

                console.log(`Indexed ${indexResult.page_count} pages`);
                if (indexResult.errors.length) {
                    console.error(indexResult.errors.join("\n"));
                }

                // Save the files
                const writeResult = await index.writeFiles({
                    outputPath: path.join(outDir, "pagefind"),
                });

                if (writeResult.errors.length) {
                    console.error(writeResult.errors.join("\n"));
                }

                console.log("Pagefind complete");
            },
        },
    };
}