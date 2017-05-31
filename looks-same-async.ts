let looksSame = require("looks-same");

export function looksSameAsync(ethalonPath : string, currentPath : string) : Promise<boolean> { 
    return new Promise((resolve, reject) => {
        looksSame(ethalonPath, currentPath, (error, equal) => {
            if(error)
                return reject(error);
            else
                resolve(equal);
        });
    }
)}