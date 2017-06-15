import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as tc from "testcafe";
var PNG = require('pngjs').PNG;

interface delegate { (pixel : Pixel) : void }
class Pixel {
    constructor(
        public Red : number,
        public Green : number,
        public Blue : number,
        public Alpha : number) { }
}

export class TestUtils {
    static RemoveTestImages(testController: TestController) {
        let testScreensPath = (testController as any).testRun.opts.screenshotPath;
        if(!!fs.existsSync(testScreensPath))
            fsExtra.removeSync(testScreensPath);
    }

    static HasPixelWithAlpha(imagePath: string): boolean {
        let result = false;
        this.ForEachPixel(imagePath, (pixel) => {
            if(pixel.Alpha < 255)
                result = true;
        });
        return result;
    }
    static HasOnlyBlackOrTransparencyPixels(imagePath: string): boolean {
        let result = true;
        this.ForEachPixel(imagePath, (pixel) => {
            let isBlackPixel = pixel.Alpha == 0 && pixel.Blue == 0 && pixel.Green == 0 && pixel.Red == 0;
            let isTransparencyPixel = pixel.Alpha == 255;
            if(!isBlackPixel && !isTransparencyPixel)
                result = true;
        });
        return result;
    }
    static ForEachPixel(imagePath: string, delegate : delegate): void {
        let buffer = fs.readFileSync(imagePath);
        let image = PNG.sync.read(buffer, { filterType: -1 });
        for (let y = 0; y < image.height; y++) {
            for (let x = 0; x < image.width; x++) {
                let idx = (image.width * y + x) << 2;
                let data = image.data;
                let pixel = new Pixel(data[idx], data[idx+1], data[idx+2], data[idx+3]); 
                delegate(pixel);
            }
        }
    }
}