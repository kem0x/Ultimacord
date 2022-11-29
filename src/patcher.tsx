import { print, waitFor } from './utils';

import { Window, expose, Patch, Find, Filters } from './webpack';
import { plugins } from './plugins';

import * as compiledPlugins from "./plugins/dist/compiledPlugins";

export interface IPatch {
    filter: (module: any) => boolean;
    replacement?: Function;
    before?: Function;
    after?: Function;
}

expose('plugins', plugins);

// @ts-ignore
async function InitPatcher() {
    print("info", 'Patcher initialized');

    for (const plugin of compiledPlugins.default) {
        const pluginsImport = `data:text/javascript;charset=utf-8,${encodeURIComponent(plugin)}`;
        await import(/* @vite-ignore */ pluginsImport); // i have to do this because vite doesn't like dynamic imports
    }

    for (const plugin of plugins) {

        if (plugin.name) {
            // print("log", "Loading plugin", plugin.name);

            if (plugin.exposes) {
                expose(plugin.name, plugin.exposes);
            }

            if (plugin.patches) {
                for (const patch of plugin.patches) {
                    if (patch.filter) {
                        Patch(patch.filter, patch);
                    }
                }
            }
        }

        if (plugin.start) {
            plugin.start();
        }
    }
}

export function UltimateDiscordExperience() {

    waitFor(() => Window?.webpackChunkdiscord_app?.push).then(async () => {
        print("info", "Webpack is defined starting patcher");

        let wreq: any;
        Window.webpackChunkdiscord_app.push([[Symbol("Ultimacord")], {}, (m: any) => wreq = m]);
        Window.webpackChunkdiscord_app.pop();

        wreq.d = (e: any, c: any) => {
            for (var d in c) {
                wreq.o(c, d) && !wreq.o(e, d) && Object.defineProperty(e, d, {
                    enumerable: true,
                    configurable: true,
                    get: c[d],
                    set: (v) => {
                        delete e[d];
                        e[d] = v;
                    }
                })
            }
        }

        await waitFor(() => Find(Filters.Code("dispatch", "subscribe")));

        await InitPatcher();

        expose('Find', Find);
        expose('Filters', Filters);
        expose('Patch', Patch);
    });
}

export function Debug() {

}