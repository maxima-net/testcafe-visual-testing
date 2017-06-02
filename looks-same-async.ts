let looksSame = require("looks-same");

export function looksSameAsync(etalonPath : string, currentPath : string, options :any = {}) : Promise<boolean> { 
    return new Promise((resolve, reject) => {
        looksSame(etalonPath, currentPath, options, (error, equal) => {
            if(error)
                return reject(error);
            else
                resolve(equal);
        });
    }
)}
export function createDiffAsync(diffPath: string, etalonPath: string, screenShotPath: string, highlightColor: string) : Promise<void> {
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