import { expose, getExposed } from "./webpack";
import { print } from "./utils";
import { IPatch } from "./patcher";

export interface IPlugin {
    name?: string;
    patches?: IPatch[];
    exposes?: { [key: string]: any };
    start?: () => void;
    stop?: () => void;
}
export const plugins: Set<IPlugin> = new Set();

expose('plugins', plugins);

export function definePlugin(target: any, propertyKey: string) {
    console.log(typeof target, typeof propertyKey, typeof target[propertyKey]);

    target[propertyKey].name = target.name;

    if (getExposed<Set<IPlugin>>('plugins')?.add(target[propertyKey])) {
        print("info", "Plugin pushed", target[propertyKey]);
    }
}