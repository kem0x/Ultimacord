import React from 'react';
import * as plugins from '../plugins';

export class quickMention {

    @plugins.define
    static _: plugins.IPlugin = {

        name: 'quickMention',
        patches: [
            {
                name: "messageActions",
                moduleFlag: "Messages.MESSAGE_UTILITIES_A11Y_LABEL",
                regex: /(null,)(.{1,3}&&!.{1,3}\?(.{1,3})\(\{key:"reply",label:.{1,10}\.Messages\.MESSAGE_ACTION_REPLY,icon:.{1,10},channel:(.+?),message:(.+?),onClick:.+?\}\))/,
                replacement: (_m: any, post: any, og: any, functionName: any, channelVar: any, messageVar: any) => {

                    const functionSig =
                        `${functionName}({
                        key: "QuickMention",
                        label: "Mention",
                        icon: ultimacord.quickMention.Icon,
                        channel: ${channelVar},
                        message: ${messageVar},
                        onClick: ()=> ultimacord.quickMention.onClick(${messageVar})
                    })`;

                    return `${post}${functionSig},${og}`;
                }
            }
        ],

        exposes: {
            Icon: () => (
                <svg
                    className="icon"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 2C6.486 2 2 6.486 2 12C2 17.515 6.486 22 12 22C14.039 22 15.993 21.398 17.652 20.259L16.521 18.611C15.195 19.519 13.633 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4C16.411 4 20 7.589 20 12V12.782C20 14.17 19.402 15 18.4 15L18.398 15.018C18.338 15.005 18.273 15 18.209 15H18C17.437 15 16.6 14.182 16.6 13.631V12C16.6 9.464 14.537 7.4 12 7.4C9.463 7.4 7.4 9.463 7.4 12C7.4 14.537 9.463 16.6 12 16.6C13.234 16.6 14.35 16.106 15.177 15.313C15.826 16.269 16.93 17 18 17L18.002 16.981C18.064 16.994 18.129 17 18.195 17H18.4C20.552 17 22 15.306 22 12.782V12C22 6.486 17.514 2 12 2ZM12 14.599C10.566 14.599 9.4 13.433 9.4 11.999C9.4 10.565 10.566 9.399 12 9.399C13.434 9.399 14.6 10.565 14.6 11.999C14.6 13.433 13.434 14.599 12 14.599Z"
                    />
                </svg>
            ),

            //@ts-ignore
            onClick: (message: any) => alert("Hello, world!")
        }
    };
}