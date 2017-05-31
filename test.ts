import * as fs from "fs";
import * as tc from "testcafe";
import { looksSameAsync } from "./looks-same-async";

const ethalonPath = 'ethalon/my-first-test.png';
const currentPath = 'current/my-first-test.png';

fixture(`Getting Started`)
    .page(`./index.html`)
    .beforeEach(async t  => {
        await t.resizeWindow(800, 600);
        if (!fs.existsSync('img/' + ethalonPath))
            await t.takeScreenshot(ethalonPath);
    });

test('My first test', async t => {
    await t.takeScreenshot(currentPath);
    let res = await looksSameAsync('img/' + ethalonPath, 'img/' + currentPath);
    await t.expect(!!res).eql(true, 'images is not equals');
});