import { print } from "./utils";


export namespace Hook {
    export function Before(object: any, method: string, callback: Function) {

        if (!object?.[method]) {
            print("error", `Method ${method} is not defined`);
            return;
        }

        const original = object[method];

        object[method] = function () {
            let args = arguments;

            callback.call(this, args);

            return object[method].original.apply(this, args);
        }

        object[method].original = original;
    }

    export function After(object: any, method: string, callback: Function) {

        if (!object?.[method]) {
            print("error", `Method ${method} is not defined`);
            return;
        }

        const original = object[method];

        object[method] = function () {
            let args = arguments;

            let res = object[method].original.apply(this, args);

            return callback.call(this, res, ...args); 
        }

        object[method].original = original;
    }

    export function Instead(object: any, method: string, callback: Function) {

        if (!object?.[method]) {
            print("error", `Method ${method} is not defined`);
            return;
        }

        const original = object[method];

        object[method] = function () {
            let args = arguments;

            return callback.call(this, original, ...args);
        }

        object[method].original = original;
    }

    export function IsHooked(fn: any) {
        return fn?.original;
    }
}

