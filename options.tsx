//import { h, render } from "preact"; // TypeScript (currently, 2.8) can't emit a proper import statement for es6 including the .js suffix and the ./ prefix, so reference it by <reference/> instead and import using the html page
/// <reference types="preact"/>

type SettingProps = { setting: ISetting };
type SettingState<T> = { value: T };
abstract class Setting<T> extends preact.Component<SettingProps, SettingState<T>> {
    protected constructor() {
        super(...arguments);
        this.onStorageChanged = this.onStorageChanged.bind(this);
        this.handleChange= this.handleChange.bind(this);
    }

    componentDidMount() {
        browser.storage.onChanged.addListener(this.onStorageChanged);
        browser.storage.local.get(this.props.setting.key).then(value => this.setState({ value: value[this.props.setting.key] }));
    }

    componentWillUnmount() {
        browser.storage.onChanged.removeListener(this.onStorageChanged);
    }

    private onStorageChanged(this: Setting<T>, changes: any, areaName: string) {
        if (areaName === "local") {
            const change = changes[this.props.setting.key] as browser.storage.StorageChange;
            if (change) {
                this.setState({ value: change.newValue });
            }
        }
    }

    protected handleChange(newValue: T) {
        browser.storage.local.set({ [this.props.setting.key]: newValue });
    }

    render(props: preact.RenderableProps<SettingProps>, state: Readonly<SettingState<T>>) {
        return <div class="setting">
            <div class="settinglabel">
                <label for={props.setting.key}>{props.setting.title}</label>
                <div class="detail">{props.setting.description}</div>
                </div>
                {this.getInputElement(props.setting.key, state.value)}  
                
             </div>;
    }

    protected abstract getInputElement(id:string, value: T): JSX.Element;
}

class Checkbox extends Setting<boolean> {
    getInputElement(id: string, value: boolean) {
        return <input type="checkbox" id={id} checked={value} onChange={e => this.handleChange((e.target as HTMLInputElement).checked)}/>;
    }
}

class Textbox extends Setting<string> {
    getInputElement(id: string, value: string) {
        return <input type="text" id={id} value={value} onChange={e => this.handleChange((e.target as HTMLInputElement).value)}/>;
    }
}

class Numberbox extends Setting<number> {
    getInputElement(id: string, value: number) {    
        return <input type="number" id={id} value={value} onChange={e => this.handleChange((e.target as HTMLInputElement).valueAsNumber)} />;
    }
}

class Menulist extends Setting<string> {
    protected getInputElement(id: string, value: string): JSX.Element {
        return <select id="{id}" onChange={e => this.handleChange((e.target as HTMLInputElement).value)}> {(this.props.setting as IOptionSetting).optionValues.map(optionValue =>
            <option value={optionValue.value} selected={optionValue.value === value}>{optionValue.label}</option>)}
               </select>;
    }
}

class RadioButtonGroup extends Setting<string> {
    protected getInputElement(id: string, value: string) {
        return <div class="radiobuttongroup" onChange={e => this.handleChange((e.target as HTMLInputElement).value)}> {(this.props.setting as IOptionSetting).optionValues.map((optionValue, index) => {
            const optionId = id + index.toString();
            return <div><input type="radio" id={optionId} name={id} value={optionValue.value} checked={optionValue.value === value} /> <label for={optionId}>{optionValue.label}</label></div>
        })}</div>;
    }
}

class Button extends Setting<never> {
    componentDidMount() { }
    componentWillUnmount() { }

    protected getInputElement(id: string, value: never): JSX.Element {
        return <button id={id} type="button" onClick={() => browser.runtime.sendMessage(this.props.setting.key)}>{(this.props.setting as IButtonSetting).text}</button>;
    }
}

const settingComponents: { [key: string]: any } = {
    "boolean": Checkbox,
    "string": Textbox,
    "integer": Numberbox,
    "menulist": Menulist,
    "radiobuttons": RadioButtonGroup,
    "button": Button,
};

type SettingsProps = { settings: ISetting[] };
class Settings extends preact.Component<SettingsProps, object> {
    render(props: SettingsProps) {
        return <form>
                   {props.settings.map(setting => {
                       const SettingComponent = settingComponents[setting.type];
                       return <SettingComponent setting={setting} key={setting.key} />;
                   })}
               </form>;
    }
}

preact.render(<Settings settings={optionsConfig} />, document.getElementById("root")!);


