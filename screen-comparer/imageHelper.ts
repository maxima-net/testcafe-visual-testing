let looksSame = require("looks-same");
let PNG = require('pngjs').PNG;
import * as fsExtra from "fs-extra";
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

    static IsLooksSameAsync(etalonPath : string, currentPath : string, maskPath: string, options :any = {}) : Promise<boolean> { 
        return new Promise((resolve, reject) => {
            const maskedEtalonPath = `${etalonPath}_masked`;
            const maskedCurrentPath = `${currentPath}_masked`;
                
            if(maskPath != null) {
                this.InsertMask(etalonPath, maskPath, maskedEtalonPath);
                this.InsertMask(currentPath, maskPath, maskedCurrentPath);
                etalonPath = maskedEtalonPath;
                currentPath = maskedCurrentPath;
            }
            
            looksSame(etalonPath, currentPath, options, (error, equal) => {
                if(maskPath != null) {
                     fsExtra.removeSync(maskedEtalonPath);
                     fsExtra.removeSync(maskedCurrentPath);
                }
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
    static InsertMask(sourceImagePath : string, maskImagePath : string, resultImagePath: string ) : void  {
        const sourceImageData = fs.readFileSync(sourceImagePath);
        const maskImageData = fs.readFileSync(maskImagePath);
        const sourceImage = PNG.sync.read(sourceImageData, { filterType: -1 });
        const maskImagе = PNG.sync.read(maskImageData, { filterType: -1 });
        if (sourceImage.height != maskImagе.height || sourceImage.width != maskImagе.width)
            throw new Error('Source images sizes is not equals');

        for (let y = 0; y < sourceImage.height; y++) {
            for (let x = 0; x < sourceImage.width; x++) {
                let idx = (sourceImage.width * y + x) << 2;
                    if (maskImagе.data[idx + 3] != 0) {
                        sourceImage.data[idx + 0] = 0;
                        sourceImage.data[idx + 1] = 0;
                        sourceImage.data[idx + 2] = 0;
                        sourceImage.data[idx + 3] = 255;
                    }
                }
        }
        let buff = PNG.sync.write(sourceImage);
        fs.writeFileSync(resultImagePath, buff);
    }
}