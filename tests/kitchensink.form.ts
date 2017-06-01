// run it like this from root of the repo
// node ./node_modules/testcafe/bin/testcafe-with-v8-flag-filter.js chrome tests/kitchensink.form.ts  -s img


import { Selector, ClientFunction } from 'testcafe';
import { ScreenComparer } from '../ts/utils';

fixture ('KitchenSink Form')
    .page ('https://js.devexpress.com/Demos/KitchenSink/')
    .beforeEach(async t  => {
        await t.resizeWindow(480, 640);
    });

const menuItem = Selector(".dx-navigation-item", { visibilityCheck: true, timeout: 3000 }).withText('Form');
const datebox = Selector(".dx-datebox").addCustomMethods({
    setValue: (datebox, date) =>
        $(datebox).data("dxDateBox").option("value", date)
});
const loginInput = Selector(".dx-texteditor-input").nth(0);
const passwordInput = Selector(".dx-texteditor-input").nth(1);
const numberBox = Selector(".dx-texteditor-input").nth(3);
const textArea = Selector(".dx-texteditor-input").nth(4);
const autoComplit = Selector(".dx-texteditor-input").nth(5);
const selectBox = Selector(".dx-texteditor-input").nth(7);
const lookupEditor = Selector(".dx-texteditor-input").nth(8);
const tagBox = Selector(".dx-tag-container");
const dateboxButton = Selector(".dx-datebox").find(".dx-dropdowneditor-button");
const toolbar = Selector(".dx-active-view .dx-toolbar-center");
const spinUpButton = Selector(".dx-numberbox-spin-up-icon");
const spinDownButton = Selector(".dx-numberbox-spin-down-icon");
const fieldHeader = Selector(".dx-fieldset-header");
const dxSwitch = Selector(".dx-switch-container");
const checkBox = Selector(".dx-checkbox-icon");
const radioButtons = Selector(".dx-radiobutton-icon");
const sliderWrapper = Selector(".dx-slider-wrapper");
const button = Selector(".dx-button").withText("Click me");


test('Form', async t => {
        await menuItem;
        await t.wait(3000);
        await ScreenComparer.Compare(t, "HomeView01");
        await t.click(menuItem);
        await t.wait(3000);
        await ScreenComparer.Compare(t, "FormView01");
        //await t.expect(datebox['setValue'](new Date(2014, 4, 26))).notOk()
        //await ScreenComparer.Compare(t, "FormView02");
        // await t.typeText(loginInput, "MyName")
        //     .typeText(passwordInput, "MyPassword")
        //     .click(dateboxButton)
        // await ScreenComparer.Compare(t, "FormView03");
        // await t.click(toolbar)
        //     .click(spinUpButton)
        //     .click(spinUpButton)
        //     .click(spinDownButton)
        //     .click(numberBox)
        //     .pressKey("backspace")
        //     .typeText(numberBox, "123")
        //     .typeText(textArea, "My comment\r")
        //     .typeText(textArea, "My comment 2")
        //     .click(fieldHeader.withText("Selectable"))
        // await ScreenComparer.Compare(t, "FormView04");
        // await t.typeText(autoComplit, "new")
        //     .click(Selector(".dx-item-content").withText("New York"))
        //     .click(Selector(".dx-lookup-field").withText("Select color ..."))
        //     .typeText(lookupEditor, "bl")
        //     .click(".dx-icon-clear")
        //     .typeText(lookupEditor, "yel")
        //     .click(Selector(".dx-item-content").withText("yellow"))
        //     .click(selectBox)
        //     .click(Selector(".dx-item-content").withText("dark"))
        //     .click(selectBox)
        //     .click(Selector(".dx-item-content").withText("light"))
        //     .click(tagBox)
        //     .click(Selector(".dx-item-content").withText("Red"))
        //     .click(tagBox)
        //     .click(Selector(".dx-item-content").withText("Green"))
        //     .click(tagBox)
        //     .click(Selector(".dx-item-content").withText("Blue"))
        //     .click(fieldHeader.withText("Selectable"))
        // await ScreenComparer.Compare(t, "FormView05");
        // await t.pressKey("pagedown")
        //     .click(dxSwitch)
        //     .click(dxSwitch)
        //     .click(checkBox)
        //     .click(checkBox)
        //     .click(radioButtons.nth(0))
        //     .click(radioButtons.nth(1))
        //     .click(radioButtons.nth(2))
        //     .click(sliderWrapper.nth(0), { offsetX: 30 })
        //     .click(sliderWrapper.nth(0), { offsetX: 200 })
        //     .click(sliderWrapper.nth(1), { offsetX: 30 })
        //     .click(sliderWrapper.nth(1), { offsetX: 200 })
        // await ScreenComparer.Compare(t, "FormView06");
        // await t.click(fieldHeader.withText("Sliders"))
        //     .pressKey("pagedown")
        //     .click(Selector(".dx-icon-image.dx-icon").nth(1))
        //     .click(button.nth(0))
        //     .click(button.nth(1))
        //     .click(button.nth(2))
        //     .click(button.nth(3))
        // await ScreenComparer.Compare(t, "FormView07");
});
