import React from 'react';

import { Lazy } from '../utils';
import { Find } from '../webpack';
import { Stores, Common } from '../common';
import * as plugins from '../plugins';

function Icon(path: string, viewBox = "0 0 24 24") {
    return ({ color, tooltip }: { color: string; tooltip: string; }) => (
        <Common.Tooltip text={tooltip} >
            {(tooltipProps: any) => (
                <svg
                    {...tooltipProps}
                    height="18"
                    width="18"
                    viewBox={viewBox}
                    fill={color}
                >
                    <path d={path} />
                </svg>
            )}
        </Common.Tooltip>
    );

}

const Icons = {
    desktop: Icon("M4 2.5c-1.103 0-2 .897-2 2v11c0 1.104.897 2 2 2h7v2H7v2h10v-2h-4v-2h7c1.103 0 2-.896 2-2v-11c0-1.103-.897-2-2-2H4Zm16 2v9H4v-9h16Z"),
    web: Icon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z"),
    mobile: Icon("M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"),
    console: Icon("M14.8 2.7 9 3.1V47h3.3c1.7 0 6.2.3 10 .7l6.7.6V2l-4.2.2c-2.4.1-6.9.3-10 .5zm1.8 6.4c1 1.7-1.3 3.6-2.7 2.2C12.7 10.1 13.5 8 15 8c.5 0 1.2.5 1.6 1.1zM16 33c0 6-.4 10-1 10s-1-4-1-10 .4-10 1-10 1 4 1 10zm15-8v23.3l3.8-.7c2-.3 4.7-.6 6-.6H43V3h-2.2c-1.3 0-4-.3-6-.6L31 1.7V25z", "0 0 50 50"),
};
type Platform = keyof typeof Icons;

const getStatusColor = Lazy(() => Find.ByCode("STATUS_YELLOW", "TWITCH", "STATUS_GREY"));

const PlatformIcon = ({ platform, status }: { platform: Platform, status: string; }) => {
    const tooltip = platform[0].toUpperCase() + platform.slice(1);
    const Icon = Icons[platform] ?? Icons.desktop;

    return <Icon color={`var(--${getStatusColor()(status)}`} tooltip={tooltip} />;
};

const PlatformIndicator = ({ user }: { user: any; }) => {
    if (!Common.Tooltip) return null;

    if (!user || user.bot) return null;

    const status = Stores.PresenceStore.getState()?.clientStatuses?.[user.id] as Record<Platform, string>;
    if (!status) return null;

    const icons = Object.entries(status).map(([platform, status]) => (
        <PlatformIcon
            key={platform}
            platform={platform as Platform}
            status={status}
        />
    ));

    if (!icons.length) return null;

    return (
        <div
            className="vc-platform-indicator"
            style={{
                display: "flex", alignItems: "center", marginLeft: "4px", gap: "4px"
            }}
        >
            {icons}
        </div>
    );
};


export class platformIcons {

    @plugins.define
    static _: plugins.IPlugin = {
        name: 'platformIcons',
        patches: [
            {
                name: "serverListDecorators",
                moduleFlag: "this.renderPremium()",
                regex: /this.renderPremium\(\)[^\]]*?\]/,
                replacement: "$&.concat(ultimacord.platformIcons.render(this.props))"
            },
            {
                name: "DMListDecorators",
                moduleFlag: "PrivateChannel.renderAvatar",
                regex: /(subText:(.{1,3})\..+?decorators:)(.+?:null)/,
                replacement: "$1[$3].concat(ultimacord.platformIcons.render($2.props))"
            },
            {
                name: "UserBadges",
                moduleFlag: "Messages.PROFILE_USER_BADGES",
                regex: /(Messages\.PROFILE_USER_BADGES,role:"group",children:)(.+?\.key\)\}\)\))/,
                replacement: "$1[ultimacord.platformIcons.render(e)].concat($2)"
            }
        ],

        exposes: {
            render: ({ user }: { user: any; }) => (<PlatformIndicator user={user} />),
        }
    };
}

