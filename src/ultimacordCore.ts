import { print, waitFor } from './utils';

import { Window, expose, Find, getExposed } from './webpack';

import * as compiledPlugins from "./plugins/dist/plugins";

import { InitCommon } from "./common";

export interface IPatch {
    name?: string;
    moduleFlag: string;
    regex: RegExp;
    replacement: string | Function;
}
const patches: Set<IPatch> = new Set();

export interface IPlugin {
    name: string;
    patches?: IPatch[];
    exposes?: { [key: string]: any };
    start?: () => void;
    stop?: () => void;
}
const plugins: Set<IPlugin> = new Set();

expose('plugins', plugins);

async function InitCore() {
    print("info", 'Patcher initialized');

    expose("originalWebpackChunkdiscordAppPush", Window.webpackChunkdiscord_app.push);

    InitCommon();

    for (const plugin of compiledPlugins.default) {
        const pluginsImport = `data:text/javascript;charset=utf-8,${encodeURIComponent(plugin)}`;
        await import(/* @vite-ignore */ pluginsImport); // i have to do this because vite doesn't like dynamic imports
    }

    for (const plugin of plugins) {

        print("log", "Loading plugin", plugin.name);

        if (plugin.exposes) {
            expose(plugin.name, plugin.exposes);
        }

        if (plugin.patches) {
            for (const patch of plugin.patches) {

                print("log", "Loading patch", patch.name ? patch.name : patch.moduleFlag);
                patches.add(patch);
            }
        }

        if (plugin.start) {
            plugin.start();
        }
    }

    Window.webpackChunkdiscord_app.push = function (chunk: any) {

        Object.entries(chunk[1]).forEach(([ID, module]: any) => {

            const moduleCode = module.toString().replace(/\n/g, '');

            for (const patch of patches) {

                let foundRegex = false;

                if (moduleCode.includes(patch.moduleFlag)) {

                    print("info", "Found module [", ID, "] with flag [", patch.moduleFlag, "]");

                    if (patch.regex.test(moduleCode)) {

                        foundRegex = true;

                        const match = moduleCode.match(patch.regex);
                        if (match) {
                            // print("info", "Found match: " + match[0]);

                            const newModuleCode = moduleCode.replace(patch.regex, patch.replacement);

                            chunk[1][ID] = (0, eval)(newModuleCode);
                        }
                    }

                    if (!foundRegex) {
                        print("error", "Found module flag for patch [", patch.name ? patch.name : patch.moduleFlag, "] but no regex match");
                    }
                }
            }
        });

        getExposed<Function>("originalWebpackChunkdiscordAppPush")(chunk);
    }
}

import type Components from "discord-types/components";

export let Tooltip: Components.Tooltip = null as any;


export function UltimateDiscordExperience() {
    waitFor(() => Window?.webpackChunkdiscord_app?.push).then(async () => {
        print("info", "Webpack is loaded starting patcher");

        await InitCore();

        expose('findByProps', Find.ByProps);
        expose('findByCode', Find.ByCode);
    });
}

export function Debug() {

}