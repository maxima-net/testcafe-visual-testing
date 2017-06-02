var looksSame = require('looks-same');
var fs = require('fs');
var etalonPath = 'etalon/my-first-test.png';
var currentPath = 'current/my-first-test.png';
 
console.log("log");
console.log(fs.existsSync('img/' + etalonPath));
console.log(fs.existsSync('img/dfsadfasd'));
looksSame('img/' + etalonPath, 'img/' + currentPath, function(error, equal) {
    result = equal;
    resError = error;
    console.log(result, resError);
});
