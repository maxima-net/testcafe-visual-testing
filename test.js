var fs = require('fs');
var looksSame = require('looks-same');
var ethalonPath = 'ethalon/my-first-test.png';
var currentPath = 'current/my-first-test.png';
 
var looksSameAsync = (ethalonPath, currentPath) => { 
    return new Promise((resolve, reject) => {
        looksSame(ethalonPath, currentPath, (error, equal)=>{
            if(error)
                return reject(error);
            else
                resolve(equal);
        })
    }
)};


fixture `Getting Started`
    .page `file:///c%3A/Users/kucherov.maksim/Desktop/testcafe/index.html`
    .beforeEach(async t  => {
        if (!fs.existsSync('img/' + ethalonPath)) {
            await t
                .takeScreenshot(ethalonPath);
        }
    });

test('My first test', async t => {
    await t
        .takeScreenshot(currentPath);
    
    var res = await looksSameAsync('img/' + ethalonPath, 'img/' + currentPath);

    console.log(t);
    
    await t.expect(!!res).eql(true, 'images is not equals');
    
});