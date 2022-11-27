import React from 'react';

import { Lazy } from './utils';
import { Find } from './webpack';
import type Components from "discord-types/components";

export const Forms = {
    get FormSection() { return (Find.ByCode("titleClassName", "sectionTitle") as any); }
};

export const Common = {
    get Tooltip() { return (Find.ByProps("Positions", "Colors") as Components.Tooltip); },
    //get Label() { return (Find.ByCode("[\"className\",\"color\"]") as any); },

    Label: ({ color, text }: { color?: string, text: string; }) => {
        return <div style={{
            padding: '0 6px', fontFamily: 'var(--font-display)', fontWeight: '500', textTransform: 'uppercase', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', borderRadius: "8px", WebkitBoxSizing: 'border-box', boxSizing: 'border-box', height: '16px', minWidth: '16px', minHeight: '16px', fontSize: '12px', lineHeight: '16px', color: 'var(--white-500)', textAlign: 'center', WebkitBoxFlex: '0', flex: '0 0 auto',
            backgroundColor: (color ? color : "var(--brand-500)")
        }}>
            {text}
        </div>
    }
}

export const Stores = {
    get PresenceStore() { return Lazy(() => Find.ByProps("setCurrentUserOnConnectionOpen"))(); },
}
