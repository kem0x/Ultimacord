import { Common } from '../common';
import * as plugins from '../plugins';
import { Filters, Find, Patch, Window } from '../webpack';

let React: typeof import("react") = Common.React;

import { default as SettingsUI } from '../settingsUI';
import { Hook } from '../hook';

export class settings {

    @plugins.define
    static _: plugins.IPlugin = {

        name: 'settings',
        description: 'settings',

        start() {
            Patch({
                filter: Filters.Regex(/Messages\.SETTINGS_ADVANCED,element:.{1,3}\},/),
                after: function (res: any, ..._args: any) {
                    const idx = res.findIndex((s: any) => s.section === "Advanced");

                    res.splice(idx + 1, 0,
                        {
                            section: "DIVIDER"
                        },
                        {
                            section: "HEADER",
                            label: "Ultimacord"
                        },
                        {
                            section: "UltimacordSettings",
                            label: "Settings",
                            icon: Window.ultimacord.settings.Icon,
                            element: () => <SettingsUI />
                        });

                    return res;
                }
            });

            Hook.After(Find(Filters.Code(").historyUnlisten"))?.prototype, "render", function (this: any, element: any, ..._args: any) {
                console.log(element);
            });
        },

        exposes: {
            Icon: <Common.UI.Label text="Alpha" color="#40b461" />
        }
    };
}