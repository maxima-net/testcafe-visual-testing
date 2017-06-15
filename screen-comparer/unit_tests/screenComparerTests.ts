import * as fs from "fs";
import { ScreenComparer } from '../../screen-comparer';
import { TestUtils } from './testUtils';

fixture(`ScreenComparerTests`)
    .page(`./test.html`)
    .beforeEach(async t  => {
        await t.resizeWindow(800, 600);
        TestUtils.RemoveTestImages(t);
    })
    .afterEach(async t => TestUtils.RemoveTestImages(t));

test('Test create equal screenshots', async t => {
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
test('Test create screenshot with diff', async t => {
    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(ScreenComparer.GetEtalonScreensPath(t, "testState0")))
            .eql(true, "etalon doesn't created");

    await t.resizeWindow(800, 500);
    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(ScreenComparer.GetScreenShootsPath(t, "testState0")))
            .eql(true, "screenshot doesn't created");
    
    await t.expect(fs.existsSync(ScreenComparer.GetDiffScreenPath(t, "testState0")))
            .eql(true, "screenshot diff was not created");
    await t.expect(ScreenComparer.Errors.length == 1)
            .eql(true, "errors not generated");

    await t.expect(TestUtils.HasPixelWithAlpha(ScreenComparer.GetScreenShootsPath(t, "testState0")))
            .eql(false, "screenshot contains alpha color");
    await t.expect(TestUtils.HasPixelWithAlpha(ScreenComparer.GetDiffScreenPath(t, "testState0")))
            .eql(true, "diff image does not contains alpha color");
    await t.expect(TestUtils.HasOnlyBlackOrTransparencyPixels(ScreenComparer.GetMaskScreenPath(t, "testState0")))
            .eql(true, "mask iange contains incorrect pixels");
})
