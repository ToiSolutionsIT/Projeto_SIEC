//Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const aluno = require('./routes/aluno');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Postagem');
const Postagem = mongoose.model("postagens");
const passport = require('passport');
require('./config/auth')(passport);
//Config session
app.use(session({
    secret: 'projetotouffic',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//Middleware
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//Config bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Config HandleBars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//Config mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp').then(()=>{
    console.log('Conectado ao mongoDB com sucesso!');
}).catch((err)=>{
    console.log(`Erro ao se conectar com o mongoDB ${err}`);
});
//Public
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res ,next)=>{
    console.log('O usuário solicitou uma nova requisição ao servidor');
    next();
});
//Rotas

// app.get('/', (req, res)=>{
//     Postagem.find().populate('evento').sort({data: 'desc'}).then((postagens)=>{
//         res.render('index', {postagens: postagens});
//     }).catch((err)=>{
//         req.flash('err_msg', 'Não foi possível listar as últimas postagens da direção!');
//         res.redirect('/404');
//     });
// });

app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/postagem/:titulo', (req, res)=>{
    Postagem.findOne({titulo: req.params.titulo}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('error_msg', 'Infelizmente essa postagem não está mais disponível!');
            res.redirect('/');
        }
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno no sistema, entre em contato com os desenvolvedores!');
        res.redirect('/');
    });
});

app.get('/404', (req, res)=>{
    res.send('Erro: 404!');
});

app.use('/admin', admin);
app.use('/aluno', aluno);
//Outros
const port = 8081
app.listen(port, ()=>{
    console.log('Servidor rodando')
;});