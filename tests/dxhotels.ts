// run it like this from root of the repo
// node ./node_modules/testcafe/bin/testcafe-with-v8-flag-filter.js chrome tests/kitchensink.form.ts  -s img


import { Selector } from 'testcafe';
import { ScreenComparer } from '../screen-comparer';

fixture ('DXHotels demo')
    .page ('https://demos.devexpress.com/RWA/dxhotels/')
    .beforeEach(async t  => {
        await t.resizeWindow(1000, 500);
    });

test('Hotel search form', async t => {        
        await ScreenComparer.Compare(t, "1.Hotel search form - Initial state");
        await t.click(Selector("#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_LocationComboBox_B-1"));
        await ScreenComparer.Compare(t, "2.Hotel search form - Location opened state");
        
        await t
            .click(Selector(".dxeListBoxItemRow_Metropolis").nth(4))
            .click(Selector("#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_SearchButton"));
        
        await ScreenComparer.Compare(t, "3.Hotel search form - Search result");

        await ScreenComparer.Finish(t);
        
});



