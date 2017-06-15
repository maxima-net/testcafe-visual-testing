
function MaskController() {
}

function post(req, res, next) {    
    var etalonMaskPath = req.body.etalonMaskPath,
        currentMaskPath = req.body.currentMaskPath;

    var fs = require("fs");
    fs.writeFileSync(etalonMaskPath, fs.readFileSync(currentMaskPath));
    res.status(200).send();
}

MaskController.prototype = {
  post: post
};

var maskController = new MaskController();

module.exports = maskController;
