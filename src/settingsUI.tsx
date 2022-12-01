import { Common } from "./common";
let React: typeof import("react") = Common.React;

function SettingsUI() {
    return (
        <Common.Forms.FormSection>

            <Common.UI.Text variant="heading-lg/bold" tag="h2" className={Common.UI.Margins.marginBottom20}>Ultimacord</Common.UI.Text>

            <Common.UI.Switch>Test</Common.UI.Switch>

        </Common.Forms.FormSection>
    )
}

export default SettingsUI;