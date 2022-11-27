import { Lazy } from './utils';
import { Find } from './webpack';
import type Components from "discord-types/components";

export const Common = {
    get Tooltip() { return (Find.ByProps("Positions", "Colors") as Components.Tooltip); },
}

export const Stores = {
    get PresenceStore() { return Lazy(() => Find.ByProps("setCurrentUserOnConnectionOpen"))(); },
}
