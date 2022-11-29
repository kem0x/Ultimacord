import { Common } from '../common';
import * as plugins from '../plugins';
import { Filters, Window } from '../webpack';

let React: typeof import("react") = Common.React;

export class settings {

    @plugins.define
    static _: plugins.IPlugin = {

        name: 'settings',
        description: 'settings',
        patches: [
            {
                filter: Filters.Regex(/Messages\.SETTINGS_ADVANCED,element:.{1,3}\},/),
                after: (res: any, ..._args: any) => {
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
                            icon: Window.ultimacord.settings.Icon
                        });
                }
            }
        ],

        exposes: {
            Icon: <Common.UI.Label text="Alpha" color="#40b461" />
        }
    };
}