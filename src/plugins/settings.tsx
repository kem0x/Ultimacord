import React from 'react';
import { Forms, Common } from '../common';
import * as plugins from '../plugins';

const Sng = () => {
    if (!Forms.FormSection) return null;

    console.log(Forms.FormSection);

    return <Forms.FormSection>
    </Forms.FormSection>
};

export class settings {

    @plugins.define
    static _: plugins.IPlugin = {

        name: 'settings',
        patches: [
            {
                name: "settings",
                moduleFlag: "Messages.ACTIVITY_PRIVACY",
                regex: /Messages\.SETTINGS_ADVANCED,element:.{1,3}\},/,
                replacement: `$& 
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
                    icon: ultimacord.settings.Icon(),
                    element: Ap
                },`
            }
        ],

        exposes: {
            Icon: () => <Common.Label text="Alpha" color="#40b461" />,

            render: () => (<Sng />),
        }
    };
}