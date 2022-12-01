import { Filters, Find } from './webpack';
import type Components from "discord-types/components";
import type Other from "discord-types/other";

export type TextVariant = "heading-sm/normal" | "heading-sm/medium" | "heading-sm/bold" | "heading-md/normal" | "heading-md/medium" | "heading-md/bold" | "heading-lg/normal" | "heading-lg/medium" | "heading-lg/bold" | "heading-xl/normal" | "heading-xl/medium" | "heading-xl/bold" | "heading-xxl/normal" | "heading-xxl/medium" | "heading-xxl/bold" | "eyebrow" | "heading-deprecated-14/normal" | "heading-deprecated-14/medium" | "heading-deprecated-14/bold" | "text-xxs/normal" | "text-xxs/medium" | "text-xxs/semibold" | "text-xxs/bold" | "text-xs/normal" | "text-xs/medium" | "text-xs/semibold" | "text-xs/bold" | "text-sm/normal" | "text-sm/medium" | "text-sm/semibold" | "text-sm/bold" | "text-md/normal" | "text-md/medium" | "text-md/semibold" | "text-md/bold" | "text-lg/normal" | "text-lg/medium" | "text-lg/semibold" | "text-lg/bold" | "display-sm" | "display-md" | "display-lg" | "code";

export type TextProps = React.PropsWithChildren & {
    variant: TextVariant;
    style?: React.CSSProperties;
    color?: string;
    tag?: "div" | "span" | "p" | "strong" | `h${1 | 2 | 3 | 4 | 5 | 6}`;
    selectable?: boolean;
    lineClamp?: number;
    id?: string;
    className?: string;
};

let React: typeof import("react");

let FluxDispatcher: Other.FluxDispatcher;

let Tooltip: Components.Tooltip;

export const Forms = {} as {
    FormTitle: Components.FormTitle;
    FormSection: any;
    FormDivider: any;
    FormText: Components.FormText;
};

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

let Text: (props: TextProps) => JSX.Element;

let Button: any;

let Switch: any;

let Margins: any;

let PresenceStore: any;

export let Common =
{
    get React() { return React ?? (React = Find(Filters.Props("useState"))); },

    get FluxDispatcher() { return FluxDispatcher ?? (FluxDispatcher = Find(Filters.Props("subscribe", "dispatch"))); },

    UI:
    {
        get Margins() { return Margins ?? (Margins = Find(Filters.Props("marginTop20"))); },

        get Tooltip() { return Tooltip ?? (Tooltip = Find(Filters.Props("Positions", "Colors"))); },

        get Label() { return Label },

        get Text() { return Text ?? (Text = Find(Filters.Code("data-text-variant", "always-white"))); },

        get Button() { return Button ?? (Button = Find(Filters.Props("Hovers", "Looks", "Sizes"))); },

        get Switch() { return Switch ?? (Switch = Find(Filters.Code("helpdeskArticleId"))); },
    },

    Forms:
    {
        get FormSection() { return Forms.FormSection ?? (Forms.FormSection = Find(Filters.Code("titleClassName", "sectionTitle"))); },

        get FormTitle() { return Forms.FormTitle ?? (Forms.FormTitle = Find(Filters.Code("errorSeparator"))); },

        get FormText() { return Forms.FormText ?? (Forms.FormText = Find(m => m.Types?.INPUT_PLACEHOLDER)); },
    },

    Stores:
    {
        get PresenceStore() { return PresenceStore ?? (PresenceStore = Find(Filters.Props("setCurrentUserOnConnectionOpen"))); }
    }
};


