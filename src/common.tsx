import { print, Lazy, waitFor } from './utils';
import { Find } from "./webpack";
import type Components from "discord-types/components";

export let Tooltip: Components.Tooltip = null as any;

export const PresenceStore = Lazy(() => Find.ByProps("setCurrentUserOnConnectionOpen"));

export async function InitCommon() {
    await waitFor(() => Find.ByProps("Positions", "Colors") !== null);
    Tooltip = Find.ByProps("Positions", "Colors");

    print("info", Tooltip.toString());

    print("info", "Commons initialized!");
}