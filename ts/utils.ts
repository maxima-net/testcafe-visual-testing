import * as fs from "fs";
import * as tc from "testcafe";
import { looksSameAsync } from "../looks-same-async";


export class ScreenComparer {
    static async Compare(testController : TestController, stateName: string) {
        let ethalonPath = this.GetEthalonScreensPath(testController, stateName);
        if (!fs.existsSync(ethalonPath)){
            await this.CreateEthalon(testController, stateName);
            await testController.expect(fs.existsSync(ethalonPath)).eql(true, "can't create ethalon");
        }
        else
            await this.CompareCore(testController, stateName);
    }

    static async CompareCore(testController : TestController, stateName: string) {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, false));
        let res = await looksSameAsync(this.GetEthalonScreensPath(testController, stateName), this.GetScreenShootsPath(testController, stateName));
        await testController.expect(!!res).eql(true, 'images is not equals');
    } 
    static async CreateEthalon(testController : TestController, stateName: string) {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, true));
    }

    static GetEthalonScreensPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, true);
    }
    static GetScreenShootsPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, false);
    }
    static GetScreensPath(testController : TestController, stateName: string, ignoreRoot: boolean, isEthalon: boolean) : string {
        let tc = testController as any;
        let screenShotPath = !ignoreRoot ? `${tc.testRun.opts.screenshotPath}/` : "";
        let fixtureName = tc.testRun.test.fixture.name;
        let testName = tc.testRun.test.name;
        let screenFolderName = isEthalon ? "ethalon" : "current";        
        let browserName = tc.testRun.browserConnection.browserInfo.browserName;
        return `${screenShotPath}${fixtureName}/${testName}/${screenFolderName}/${stateName}/${browserName}.png`;
    }
}