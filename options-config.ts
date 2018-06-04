type SettingType = "boolean" | "string" | "integer" |  OptionSettingType | "button";
type OptionSettingType = "menulist" | "radiobuttons";
interface ISetting {
    key: string,
    title: string,
    type: SettingType,
    description?: string,
}

interface IOptionSetting extends ISetting {
    type: OptionSettingType,
    optionValues: OptionValue[],
}

interface IButtonSetting extends ISetting {
    text: string
}

type OptionValue = { value: string, label: string }

/* This file defines the settings presented to the user in the inline options. It must define a variable named optionsConfig as an
 * array of settings objects. Each setting object must have the following properties on it:
 * 
 * key: The key for the setting, as passed to browser.storage.local.get and .set to read and write the setting. Also used as the id for the setting controls.
 * title: The main text that appears on the left of the setting
 * description: (optional) The smaller grey text that appears below the title
 * type: The type of control to use for the setting. This may be one of:
 *    boolean
 *    string
 *    integer
 *    menulist
 *    radiobuttons
 *    button
 * 
 * For menulist and radiobuttons types, a further property must be provided:
 * 
 * optionValues: an array of objects with properties {value, label}. Each one represents one of the values which may be picked by the user.
 * 
 * For the button type, a further property must be provided:
 * 
 * text: The text to display on the button itself
 * 
 * Button types work slightly differently in that they do not get or set values from browser.storage.local, but instead when
 * clicked will send their key value as a message (using browser.runtime.sendMessage).
 */

const optionsConfig: ISetting[] = [
    {
        key: "1",
        title: "Boolean no description",
        type: "boolean",
    },
    {
        key: "2",
        title: "Boolean with a description",
        type: "boolean",
        description: "A description",
    },
    {
        key: "3",
        title: "Integer",
        type: "integer",
        description: "A description",
    },
    {
        key: "4",
        title: "String",
        type: "string",
        description: "A description",
    },
    {
        key: "5",
        title: "String no description",
        type: "string",
    },
    {
        key: "6",
        title: "Dropdown",
        type: "menulist",
        optionValues: [
            { value: "1", label: "Option one" },
            { value: "2", label: "Option two" },
            { value: "3", label: "Option three" },
        ]
    } as IOptionSetting,
    {
        key: "7",
        title: "Radio button choices",
        description: "Radio button description",
        type: "radiobuttons",
        optionValues: [
            { value: "c", label: "Option one" },
            { value: "b", label: "Option two" },
            { value: "a", label: "Option three" },
        ]
    } as IOptionSetting,
    {
        key: "Command:TestButton",
        title: "Button title",
        description: "Button description",
        text: "A Button ",
        type: "button",
    } as IButtonSetting
];
