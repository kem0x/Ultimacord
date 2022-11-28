import React from 'react';

import { print, waitFor } from './utils';

import { Window, expose, Find } from './webpack';
import { plugins } from './plugins';

import * as compiledPlugins from "./plugins/dist/compiledPlugins";
import { Common } from './common';

export interface IPatch {
    name?: string;
    moduleFlag: string;
    regex: RegExp;
    replacement: string | Function;
}
export const patches: Set<IPatch> = new Set();

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

                    // print("log", "Loading patch", patch.name ? patch.name : patch.moduleFlag);
                    patches.add(patch);
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

        // await InitPatcher();

        expose('find', Find);
        expose('test', <Common.Label text="Alpha" color="#40b461" />);
    });
}

export function Debug() {

}