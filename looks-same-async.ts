let looksSame = require("looks-same");

export function looksSameAsync(ethalonPath : string, currentPath : string, options :any = {}) : Promise<boolean> { 
    return new Promise((resolve, reject) => {
        looksSame(ethalonPath, currentPath, options, (error, equal) => {
            if(error)
                return reject(error);
            else
                resolve(equal);
        });
    }
)}