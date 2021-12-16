let userController = require('./user.controller');

export let updatePassword = function (req, res) {
    var user = req.resetPassword.forUser;
    
    user.save(function (err) {
        if (err) {
            return res.status(400).send(new Error(userController.getErrorMessage(err)))
        } else {
            res.json({resetPassword: "This was originally just 'resetPassword', where resetPassword was set to a new ResetPasswordModel(req.body).  Not sure if this makes any sense though.  Need to keep digging"});
            //TODO: Keep diging
        }
    })
}