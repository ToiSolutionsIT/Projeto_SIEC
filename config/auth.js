const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//Model usuário
require('../models/Usuario');
const Usuario = mongoose.model('UsersAdmin');
//ecportando o módulo
module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done)=>{
        Usuario.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: 'Essa conta não existe!'});
            }

            bcrypt.compare(senha, usuario.senha, (err, sucesso)=>{
                if(sucesso){
                    return done(null, usuario);
                }else{
                    return done(null, false, {message: 'Senha incorreta!'});
                }
            });
        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done)=>{
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        });
    });
}