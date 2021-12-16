const config = require('../../../config/config');

let jwt = require('jsonwebtoken');
let nodemailer = require('../../../config/lib/nodemailer')();
let ResetPasswordModel = require('mongoose').model('ResetPassword');

let UserModel = require('mongoose').model('User');


let getErrorMessage = function (err) {
    let message = '';
    
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'userName already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    
    return message;
}

export let create = function (req, res, next) {
    if (!req.user) {
        let user = new UserModel(req.body);
        let message = null;
        
        user.provider = 'local';
        
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            
            req.login(user, function (err) {
                if (err) return next(err);
                
                res.json(user);
            })

        })
    } else {
        return next(new Error('Admin interface to create a user as an existing user has not been implemented'));
    }
};

export let list = function (req, res, next) {
    let query = {};
    
    if (req.body != null) {
        query = req.body;
    }
    
    UserModel.find(query, function (err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });
};

export let deleteUser = function (req, res, next) {
    var id = req.params.id;
    
    if (id == null) {
        UserModel.remove({}, function (err, users) {
            if (err) {
                return next(err);
            } else {
                res.json(users);
            }
        })
    } else {
        let user = UserModel.findByIdAndRemove(id, function (er) {
            if (er == null) {
                res.json({ "deleted": id });
            } else {
                return next(er);
            }
        });
    }
}

export let signout = function (req, res) {
    res.clearCookie('jsonWebToken');
    res.json({});
};

export let decodeToken = function (req, res, next) {
    var token = req.cookies.jsonWebToken;
    // console.log('token = ' + JSON.stringify(token));
    
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) {
            return res.status(401).send("Unable to verify request token.  Unauthorized access");
        } else {
            req.user = decoded;
            next();
        }
    })
}

export let verifyToken = function (req, successFunction, failureFunction) {
    var token = req.cookies.jsonWebToken;
    
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) {
            failureFunction(err);
        } else {
            req.user = decoded;
            successFunction();
        }
    })

}

export let userById = function (req, res, next, id) {
    UserModel.findById(id).exec(function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load user ' + id));
        
        req.user = user;
        next();
    })
}

export let getUserById = function (req, res, next) {
    console.log('req.id = ' + req.params.id);
    UserModel.findById(req.params.id).exec(function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load user ' + req.params.id));
        
        res.json(user);
    })
}

export let requestPasswordReset = function (req, res) {
    UserModel.findOne({ 'email': req.body.email }).exec(function (err, user) {
        if (err)
            return res.status(400).send(new Error(getErrorMessage(err)));
        if (!user)
            return res.status(400).send(new Error('No user registered with email ' + req.body.email));
        
        var resetPassword = new ResetPasswordModel({});
        resetPassword.forUser = user;
        
        resetPassword.save(function (err) {
            if (err) {
                return res.status(400).send(new Error(getErrorMessage(err)));
            }
            
            var message = {
                from: "testuser@centrifugeit.com", // sender address
                to: user.email, // list of receivers
                subject: 'Password reset for ' + user.fullName, // Subject line
                text: 'Follow this link to change your password https://www.evenifitswrong.com/#!/resetPassword/' + resetPassword.hash, // plaintext body
        //html: '<b>Hello world ✔</b>' // html body
            };
            
            nodemailer.smtpTransport.sendMail(message, function (error, info) {
                if (error) {
                    return res.status(400).send(new Error(getErrorMessage(err)));
                }
                
                res.json({ message: "Password change email sent for " + user.username });

            });

        })
    })
};

export let resetPasswordByHash = function (req, res, next, hash) {
    ResetPasswordModel.findOne({ 'hash': hash }).populate('forUser').exec(function (err, resetPassword) {
        if (err) return next(err);
        if (!resetPassword) return next(new Error('Failed to load password reset information ' + hash));
        
        req.resetPassword = resetPassword;
        next();
    })
}

export let resetPassword = function (req, res, next) {
    ResetPasswordModel.findOne({ 'hash': req.body.hash }).populate('forUser').exec(function (err, resetPassword) {
        if (err) return next(err);
        if (resetPassword) {
            var user = resetPassword.forUser;
            user.password = req.body.newPassword;
            
            user.save(function (err) {
                if (err) {
                    return res.status(400).send(new Error(getErrorMessage(err)))
                } else {
                    resetPassword.remove(function (error, resetPassword) {
                        if (error) {
                            return next(error);
                        }
                    });
                    
                    res.json(resetPassword);
                }
            });
        } else {
            return res.status(400).send(new Error('Failed to load password reset information ' + req.body.hash))
        }
        

    });
};