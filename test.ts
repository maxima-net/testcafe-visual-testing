import * as fs from "fs";
import * as tc from "testcafe";
import { looksSameAsync } from "./looks-same-async";
import { ScreenComparer } from './screen-comparer/utils';

fixture(`Getting Started`)
    .page(`./index.html`)
    .beforeEach(async t  => await t.resizeWindow(800, 600));

test('My first test', async t => {
    await ScreenComparer.Compare(t, 'stait0');
});