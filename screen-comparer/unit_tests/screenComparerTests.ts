import * as fs from "fs";
import * as tc from "testcafe";
import { looksSameAsync } from "../looks-same-async";
import { ScreenComparer } from '../../screen-comparer';
import * as path from "path";
import * as fsExtra from "fs-extra";

function RemoveTestImages(testController: TestController) {
    let testScreensPath = (testController as any).testRun.opts.screenshotPath;
    if(!!fs.existsSync(testScreensPath))
        fsExtra.removeSync(testScreensPath);
}

fixture(`ScreenComparerTests`)
    .page(`./test.html`)
    .beforeEach(async t  => {
        await t.resizeWindow(800, 600);
        RemoveTestImages(t);
    })
    .afterEach(async t => RemoveTestImages(t));

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
})
