let looksSame = require("looks-same");
let PNG = require('pngjs').PNG;
import * as fs from "fs";

export class ImageHelper {
    static CreateDiffAsync(diffPath: string, etalonPath: string, screenShotPath: string, highlightColor: string) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            looksSame.createDiff({
                reference: etalonPath,
                current: screenShotPath,
                diff: diffPath,
                highlightColor: highlightColor
            }, e => {
                if(e && e.message)
                    reject(e);
                else
                    resolve();
            });
        });
    }

    static IsLooksSameAsync(etalonPath : string, currentPath : string, options :any = {}) : Promise<boolean> { 
        return new Promise((resolve, reject) => {
            looksSame(etalonPath, currentPath, options, (error, equal) => {
                if(error)
                    return reject(error);
                else
                    resolve(equal);
            });
        }
    )}

    static CreateMask(diffImagePath : string, maskImagePath : string) : void  {
        const data = fs.readFileSync(diffImagePath);
        const image = PNG.sync.read(data, { filterType: -1 });
        for (let y = 0; y < image.height; y++) {
            for (let x = 0; x < image.width; x++) {
                let idx = (image.width * y + x) << 2;
                    if (image.data[idx + 3] < 255) {
                        image.data[idx + 0] = 0;
                        image.data[idx + 1] = 0;
                        image.data[idx + 2] = 0;
                        image.data[idx + 3] = 255;
                    } else {
                        image.data[idx + 3] = 0;
                    }
            }
        }
        let buff = PNG.sync.write(image);
        fs.writeFileSync(maskImagePath, buff);
    }
}