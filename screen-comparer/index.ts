import * as fs from "fs";
import * as tc from "testcafe";
import * as datefromat from "dateformat";
import { looksSameAsync, createDiffAsync } from "./looks-same-async";
let looksSame = require("looks-same");

enum ScreenType { Etalon, Current, Diff };

class ErrorInfo {
    constructor(diffPath: string, stateName: string) {
        this.DiffPath = diffPath;
        this.StateName = stateName;
    }
    DiffPath : string;
    StateName : string;

    GetErrorMessage() : string {
        return `StateName: ${this.StateName}\r\nDiffPath: ${this.DiffPath}\r\n`;
    }
}

export class ScreenComparer {
    static readonly HighlightColor = "rgba(255,0,255,100)";
    static Errors : Array<ErrorInfo> = new Array<ErrorInfo>();
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
        let isEqual = await looksSameAsync(etalonPath, screenShotPath, {ignoreCaret: true});

        if(!isEqual) {
            let diffPath = this.GetDiffScreenPath(testController, stateName);
            await createDiffAsync(diffPath, etalonPath, screenShotPath, this.HighlightColor);
            this.Errors.push(new ErrorInfo(diffPath, stateName));
        }
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

    static async Finish(testController : TestController) {
        let errorString = "";
        this.Errors.forEach(item => errorString += item.GetErrorMessage());
        this.Errors = new Array<ErrorInfo>();
        await testController.expect(!errorString).eql(true, `ScreenComparer tests FAILED!\r\n${errorString}`);
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
