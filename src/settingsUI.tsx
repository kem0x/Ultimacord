import { Common } from "./common";
let React: typeof import("react") = Common.React;

function SettingsUI() {
    return (
        <div>
            <h1>Settings</h1>
        </div>
        /*<Common.Form.FormSection>
            <Common.UI.Text variant="heading-md/normal" tag="h2" className={Common.UI.Margins.marginBottom8}>
                Patch Helper
            </Common.UI.Text>
        </Common.Form.FormSection>*/
    )
}

export default SettingsUI;