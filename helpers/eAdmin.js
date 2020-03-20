module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }

        req.flash('error_msg', 'você deve ser um administrador para acessar essa página!');
        res.redirect('/');
    }
}