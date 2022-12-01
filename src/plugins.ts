import { getExposed } from './webpack';
import { print } from "./utils";

export interface IPlugin {
    name: string;
    description: string;
    exposes?: { [key: string]: any };
    start?: () => void;
    stop?: () => void;
}
export const plugins: Set<IPlugin> = new Set();

export function define(target: any, propertyKey: string) {
    if (getExposed<Set<IPlugin>>('plugins')?.add(target[propertyKey])) {
        print("info", "Plugin pushed", target[propertyKey].name);
    }
}