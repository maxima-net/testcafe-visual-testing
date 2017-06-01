import * as fs from "fs";
import * as tc from "testcafe";
import * as datefromat from "dateformat";
import { looksSameAsync } from "../looks-same-async";


export class ScreenComparer {
    private static initDate: Date;
    static get InitDate(): Date {
        if (this.initDate === undefined) 
            this.initDate = new Date();
        return this.initDate;
    }

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
        await testController.expect(!!res).eql(true, `images is not equals. State: ${stateName}`);
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
        let date = this.InitDate;

        let currentDateTime = !isEthalon 
            ? `${datefromat(date, "yyyy-dd-mm HH-MM-ss")}/` 
            : "";
        let screenFolderName = isEthalon ? "ethalon" : "current";
        let browserName = tc.testRun.browserConnection.browserInfo.browserName;
        return `${screenShotPath}${fixtureName}/${testName}/${screenFolderName}/${currentDateTime}${stateName}/${browserName}.png`;
    }
}