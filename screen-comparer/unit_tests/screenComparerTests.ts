import * as fs from "fs";
import { ScreenComparer } from '../../screen-comparer';
import { TestUtils } from './testUtils';
import { ClientFunction } from 'testcafe';

fixture(`ScreenComparerTests`)
    .page(`./test.html`)
    .beforeEach(async t  => {
        await t.resizeWindow(800, 600);
        TestUtils.RemoveTestImages(t);
    })
    .afterEach(async t => TestUtils.RemoveTestImages(t));

test('Test compare equal screenshots', async t => {
    await ScreenComparer.Compare(t, 'testState0');

    await t.expect(fs.existsSync(ScreenComparer.GetEtalonScreensPath(t, "testState0")))
            .eql(true, "etalon doesn't created");

    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(ScreenComparer.GetScreenShootsPath(t, "testState0")))
            .eql(true, "screenshot doesn't created");
    await t.expect(fs.existsSync(ScreenComparer.GetDiffScreenPath(t, "testState0")))
            .eql(false, "screenshot diff was created");

    await ScreenComparer.Finish(t);
})
test('Test compare different screenshots', async t => {
    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(ScreenComparer.GetEtalonScreensPath(t, "testState0")))
            .eql(true, "etalon doesn't created");

    await ClientFunction(() => document.getElementById('button').style.backgroundColor = 'red')();

    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(ScreenComparer.GetScreenShootsPath(t, "testState0")))
            .eql(true, "screenshot doesn't created");
    
    await t.expect(fs.existsSync(ScreenComparer.GetDiffScreenPath(t, "testState0")))
            .eql(true, "screenshot diff was not created");
    await t.expect(fs.existsSync(ScreenComparer.GetCurrentMaskScreenPath(t, "testState0")))
            .eql(true, "mask images was not created");
    await t.expect(ScreenComparer.Errors.length)
            .eql(1, "errors not generated");

    await t.expect(TestUtils.HasPixelWithAlpha(ScreenComparer.GetScreenShootsPath(t, "testState0")))
            .eql(false, "screenshot contains alpha color");
    await t.expect(TestUtils.HasPixelWithAlpha(ScreenComparer.GetDiffScreenPath(t, "testState0")))
            .eql(true, "diff image does not contains alpha color");
    await t.expect(TestUtils.HasOnlyBlackOrTransparencyPixels(ScreenComparer.GetCurrentMaskScreenPath(t, "testState0")))
            .eql(true, "mask iange contains incorrect pixels");
    
    let currentMaskPath = ScreenComparer.GetCurrentMaskScreenPath(t, "testState0");
    let etalonMaskPath = ScreenComparer.GetEtalonMaskScreenPath(t, "testState0");

    fs.writeFileSync(etalonMaskPath, fs.readFileSync(currentMaskPath));
    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(ScreenComparer.Errors.length)
            .eql(1, "masking does not works");
})
