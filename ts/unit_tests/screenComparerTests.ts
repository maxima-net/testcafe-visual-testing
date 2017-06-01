import * as fs from "fs";
import * as tc from "testcafe";
import { looksSameAsync } from "../../looks-same-async";
import { ScreenComparer } from '../utils';
import * as path from "path";
import * as fsExtra from "fs-extra";

fixture(`ScreenComparerTests`)
    .page(`./test.html`)
    .beforeEach(async t  => await t.resizeWindow(800, 600));

test('Test create ethalon', async t => {
    let testScreensPath = (t as any).testRun.opts.screenshotPath;
    
    if(!!fs.existsSync(testScreensPath))
        fsExtra.removeSync(testScreensPath);

    let ethalonPath = ScreenComparer.GetEthalonScreensPath(t, "testState0");
    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(ethalonPath))
            .eql(true, "ethalon doesn't created");

    let screenshotPath = ScreenComparer.GetScreenShootsPath(t, "testState0");
    await ScreenComparer.Compare(t, 'testState0');
    await t.expect(fs.existsSync(screenshotPath))
            .eql(true, "screenshot doesn't created");

    fsExtra.removeSync(testScreensPath);
})