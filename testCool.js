comparer = require('ourComparer');

fixture `Getting Started`
    .page `file:///c%3A/Users/kucherov.maksim/Desktop/testcafe/index.html`

test('My first test', async t => {
    comparer.checkView(t);
    t.focus();
    comparer.checkView(t);
    t.click();
    comparer.checkView(t);     
});