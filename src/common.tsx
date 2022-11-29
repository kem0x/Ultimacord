import { Filters, Find } from './webpack';
import type Components from "discord-types/components";
import type Other from "discord-types/other";

let React: typeof import("react");

let FluxDispatcher: Other.FluxDispatcher;

let Tooltip: Components.Tooltip;

let FormSection: any;

let Label = ({ color, text }: { color?: string, text: string; }) => {
    return <div style={{
        padding: '0 6px',
        fontFamily: 'var(--font-display)',
        fontWeight: '500',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        borderRadius: "8px",
        WebkitBoxSizing: 'border-box',
        boxSizing: 'border-box',
        height: '16px',
        minWidth: '16px',
        minHeight: '16px',
        fontSize: '12px',
        lineHeight: '16px',
        color: 'var(--white-500)',
        textAlign: 'center',
        WebkitBoxFlex: '0',
        flex: '0 0 auto',
        backgroundColor: (color ? color : "var(--brand-500)")
    }}>
        {text}
    </div>
};

let PresenceStore: any;

export let Common =
{
    get React() { return React ?? (React = Find(Filters.Props("useState"))); },

    get FluxDispatcher() { return FluxDispatcher ?? (FluxDispatcher = Find(Filters.Props("subscribe", "dispatch"))); },

    UI:
    {
        get Tooltip() { return Tooltip ?? (Tooltip = Find(Filters.Props("Positions", "Colors"))); },

        get FormSection() { return FormSection ?? (FormSection = Find(Filters.Code("titleClassName", "sectionTitle"))); },

        get Label() { return Label },
    },

    Stores:
    {
        get PresenceStore() { return PresenceStore ?? (PresenceStore = Find(Filters.Props("setCurrentUserOnConnectionOpen"))); }
    }
};


