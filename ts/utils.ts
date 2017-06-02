import * as fs from "fs";
import * as tc from "testcafe";
import * as datefromat from "dateformat";
import { looksSameAsync } from "../looks-same-async";
let looksSame = require("looks-same");

enum ScreenType { Etalon, Current, Diff };

export class ScreenComparer {
    static readonly HighlightColor = "rgba(255,0,255,100)";

    private static initDate: Date;
    static get InitDate(): Date {
        if (this.initDate === undefined) 
            this.initDate = new Date();
        return this.initDate;
    }

    static async Compare(testController : TestController, stateName: string) {
        let etalonPath = this.GetEtalonScreensPath(testController, stateName);
        if (!fs.existsSync(etalonPath)) {
            await this.CreateEtalon(testController, stateName);
            await testController.expect(fs.existsSync(etalonPath)).eql(true, "can't create etalon");
        } else {
            await this.CompareCore(testController, stateName);
        }
    }

    static async CompareCore(testController : TestController, stateName: string) {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, ScreenType.Current));

        let etalonPath = this.GetEtalonScreensPath(testController, stateName);
        let screenShotPath = this.GetScreenShootsPath(testController, stateName);
        let isEqual = await looksSameAsync(etalonPath, screenShotPath);

        if(!isEqual) {
            console.log('Create diff');
            looksSame.createDiff({
                reference: etalonPath,
                current: screenShotPath,
                diff: this.GetDiffScreenPath(testController, stateName),
                highlightColor: this.HighlightColor
            }, async function(error) {
                await testController.expect(false).eql(true, `can't create diff. State: ${stateName}`);
            });
        }
        await testController.expect(isEqual).eql(true, `images is not equals. State: ${stateName}`);
    } 
    static async CreateEtalon(testController : TestController, stateName: string) {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, ScreenType.Etalon));
    }
    static GetEtalonScreensPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, ScreenType.Etalon);
    }
    static GetScreenShootsPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, ScreenType.Current);
    }
    static GetDiffScreenPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, ScreenType.Diff);
    }

    static GetScreensPath(testController : TestController, stateName: string, ignoreRoot: boolean, screenType: ScreenType) : string {
        let tc = testController as any;
        let screenShotPath = !ignoreRoot ? `${tc.testRun.opts.screenshotPath}/` : "";
        let fixtureName = tc.testRun.test.fixture.name;
        let testName = tc.testRun.test.name;
        let date = this.InitDate;

        let isEtalon = screenType == ScreenType.Etalon;
        let currentDateTime = !isEtalon 
            ? `${datefromat(date, "yyyy-dd-mm HH-MM-ss")}/` 
            : "";
        let screenFolderName = isEtalon ? "etalon" : "current";

        let browserName = tc.testRun.browserConnection.browserInfo.browserName;
        let screenFileName = screenType != ScreenType.Diff 
            ? `${browserName}.png`
            : `${browserName}_diff.png`;
        return `${screenShotPath}${fixtureName}/${testName}/${screenFolderName}/${currentDateTime}${stateName}/${screenFileName}`;
    }
}