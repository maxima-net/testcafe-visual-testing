
function EtalonController() {
}

function post(req, res, next) {
    var etalonPath = req.body.etalonPath,
        artefactPath = req.body.artefactPath;

    var fs = require("fs");
    fs.writeFileSync(etalonPath, fs.readFileSync(artefactPath));
    res.status(200).send();
}

EtalonController.prototype = {
  post: post
};

var etalonController = new EtalonController();

module.exports = etalonController;
