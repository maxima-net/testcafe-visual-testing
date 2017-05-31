import * as fs from "fs";
import * as tc from "testcafe";
import { looksSameAsync } from "../looks-same-async";


export class ScreenComparer {
    static async Compare(testController : TestController, stateName: string) : Promise<void> {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, false));
        let res = await looksSameAsync(this.GetEthalonScreensPath(testController, stateName), this.GetScreenShootsPath(testController, stateName));
        await testController.expect(!!res).eql(true, 'images is not equals');
    }

    static GetEthalonScreensPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, true);
    }
    static GetScreenShootsPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, false);
    }
    static GetScreensPath(testController : TestController, stateName: string, ignoreRoot: boolean, isEthalon: boolean) : string {
        let tc = testController as any;
        let screenShootPath = !ignoreRoot ? `${tc.ctx.opts.screenShootPath}/` : "";
        let fixtureName = tc.testRun.test.fixture.name;
        let testName = tc.testRun.test.name;
        let browserName = tc.testRun.browserConnection.browserInfo.browserName;
        let screenFolderName = isEthalon ? "ethalon" : "current";
        return `${screenShootPath}${fixtureName}/${testName}/${screenFolderName}/${stateName}.png`;
    }
}