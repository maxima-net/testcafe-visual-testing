
function MaskController() {
}

function post(req, res, next) {    
  res.status(200).json(req.body);
}

MaskController.prototype = {
  post: post
};

var maskController = new MaskController();

module.exports = maskController;
