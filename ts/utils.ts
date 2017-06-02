import * as fs from "fs";
import * as tc from "testcafe";
import * as datefromat from "dateformat";
import { looksSameAsync, createDiffAsync } from "../looks-same-async";
let looksSame = require("looks-same");

enum ScreenType { Ethalon, Current, Diff };

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
        let ethalonPath = this.GetEthalonScreensPath(testController, stateName);
        if (!fs.existsSync(ethalonPath)) {
            await this.CreateEthalon(testController, stateName);
            await testController.expect(fs.existsSync(ethalonPath)).eql(true, "can't create ethalon");
        } else {
            await this.CompareCore(testController, stateName);
        }
    }

    static async CompareCore(testController : TestController, stateName: string) {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, ScreenType.Current));

        let ethalonPath = this.GetEthalonScreensPath(testController, stateName);
        let screenShotPath = this.GetScreenShootsPath(testController, stateName);
        let isEqual = await looksSameAsync(ethalonPath, screenShotPath);

        if(!isEqual) {
            let diffPath = this.GetDiffScreenPath(testController, stateName);
            await createDiffAsync(diffPath, ethalonPath, screenShotPath, this.HighlightColor);
            this.Errors.push(new ErrorInfo(diffPath, stateName));
        }
        //await testController.expect(isEqual).eql(true, `images is not equals. State: ${stateName}`);
    }
    static async CreateEthalon(testController : TestController, stateName: string) {
        await testController.takeScreenshot(this.GetScreensPath(testController, stateName, true, ScreenType.Ethalon));
    }
    static GetEthalonScreensPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, ScreenType.Ethalon);
    }
    static GetScreenShootsPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, ScreenType.Current);
    }
    static GetDiffScreenPath(testController : TestController, stateName: string) : string {
        return this.GetScreensPath(testController, stateName, false, ScreenType.Diff);
    }

    static async Finish(testController : TestController) {
        let errorString : string;
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

        let isEthalon = screenType == ScreenType.Ethalon;
        let currentDateTime = !isEthalon 
            ? `${datefromat(date, "yyyy-dd-mm HH-MM-ss")}/` 
            : "";
        let screenFolderName = isEthalon ? "ethalon" : "current";

        let browserName = tc.testRun.browserConnection.browserInfo.browserName;
        let screenFileName = screenType != ScreenType.Diff 
            ? `${browserName}.png`
            : `${browserName}_diff.png`;
        return `${screenShotPath}${fixtureName}/${testName}/${screenFolderName}/${currentDateTime}${stateName}/${screenFileName}`;
    }
}
