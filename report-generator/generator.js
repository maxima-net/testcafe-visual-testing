var fs = require('fs');
var mustache = require('mustache');
var path = require('path');

var templateStr = fs.readFileSync(path.join(__dirname, 'template.html')).toString();
var imagePath = 'img/';
var result = [];
var fixtureName = '';

if (fs.existsSync(imagePath)) {
    fs.readdirSync(imagePath)
        .filter(fixtureDir =>{
            return fs.lstatSync(path.join(imagePath, fixtureDir)).isDirectory() && fixtureDir !== 'thumbnails';
        })
        .forEach(fixture => {
            fixtureName = fixture;
            fs.readdirSync(path.join(imagePath, fixture))
                .filter(testDir =>{
                    return fs.lstatSync(path.join(imagePath, fixture, testDir)).isDirectory() && testDir !== 'thumbnails';
                })
                .forEach(test => {
                    var testDirectory = path.join(imagePath, fixture, test);
                    var etalonPath = path.join(testDirectory, 'etalon/');
                    var currentPath = path.join(testDirectory, 'current/');

                    if (fs.existsSync(currentPath)) {
                        var currentFolders = fs.readdirSync(currentPath);
                        var lastTestFolder = path.join(currentPath, currentFolders[currentFolders.length - 1]);//last dir in current

                        fs.readdirSync(lastTestFolder)
                            .forEach((screenShotName, i) => {
                                var img = path.join(lastTestFolder, screenShotName, 'chrome.png');
                                var diff = path.join(lastTestFolder, screenShotName, 'chrome_diff.png');
                                var ethImg = path.join(etalonPath, screenShotName, 'chrome.png');
                                
                                
                                var failed = fs.existsSync(path.resolve(diff));

                                var forCase = {
                                    current: img,
                                    diff:    diff,
                                    etalon:  ethImg,
                                    failed:  failed ? 'failed' : '',
                                    name:    screenShotName,
                                    index: i
                                };

                                result.push(forCase);
                            });
                    }

                    
                });
        });
}

fs.writeFileSync('report.html', mustache.render(templateStr, { fixture: fixtureName, items: result }));
console.log('Report path: ' + path.resolve('report.html'));