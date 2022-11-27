import esbuild from "esbuild";

import dotenv from 'dotenv';

import {
    readdir,
    unlink,
    appendFile,
    writeFile,
    mkdir
} from "fs/promises";

import {
    dirname
} from "path";

dotenv.config();

console.log("Building plugins...");

const distPath = "src/plugins/dist/compiledPlugins.ts";

readdir("src/plugins", {
    withFileTypes: true
}).then(async files => {
    try {
        await unlink(distPath);
    } catch {}

    await mkdir(dirname(distPath), {
        recursive: true
    }, err => {
        if (err) return cb(err);
    })

    await appendFile(distPath, "export default [", (err) => {
        if (err) throw err;
    });

    files.filter(dirent => dirent.isFile()).forEach(async (file) => {
        let result = await esbuild.build({
            bundle: true,
            minify: process.env.minify === "true" ? true : false,
            target: ['chrome80'],
            entryPoints: [`src/plugins/${file.name}`],
            write: false,
        });

        if (result.errors && result.errors.length > 0) {
            console.error(result.errors);
            process.exit(1);
        }

        if (result.warnings && result.warnings.length > 0) {
            console.warn(result.warnings);
        }

        if (result.outputFiles.length == 0) {
            console.error("No output files, odd...");
            process.exit(1);
        }

        const script = result.outputFiles[0].text.replace(/unsafeWindow/g, "window");
        const escapeScript = JSON.stringify(script).replace(/'/g, "\\'") + ",";

        await appendFile(distPath, escapeScript, (err) => {
            if (err) throw err;
        });

        console.log(`Built ${file.name}`);

        // fuck me i hate js so much that i don't wanna bother thinking about this more
        if (file.name == files[files.length - 1].name) {
            await appendFile(distPath, "];", (err) => {
                if (err) throw err;
            });
        }
    });
});