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