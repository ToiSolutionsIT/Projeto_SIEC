const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Evento');
const Evento = mongoose.model("eventos");
require('../models/Curso');
const Curso = mongoose.model("cursos");
require('../models/Postagem');
const Postagem = mongoose.model("postagens");
require('../models/Usuario');
const Usuario = mongoose.model("UsersAdmin");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {eAdmin} = require('../helpers/eAdmin');
//Rotas
router.get('/', (req, res)=>{
    res.render("admin/index");
});

router.get('/registro', eAdmin, (req, res)=>{
    res.render('admin/registro');
});

router.post('/registro', eAdmin, (req, res)=>{
    var errors = new Array();

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errors.push({text: 'Nome do diretor inválido!'});
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: 'Email inválido!'});
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        errors.push({text: 'Senha inválida'}); 
    }

    if(req.body.senha.length < 4){
        errors.push({text: 'Senha muito curta! Tente cadastrar uma senha maior do que 4 caracteres!'});
    }

    if(req.body.senha != req.body.senha2){
        errors.push({text: 'As senhas não conferem! Tente novamente!'});
    }

    if(errors.length > 0){
        res.render('admin/registro', {errors: errors});
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg', 'Já existe uma conta com esse email no banco de dados!');
                res.redirect('/admin/registro');
            }else{
                const novoAdmin = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: 1
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoAdmin.senha, salt, (err, hash)=>{
                        if(err){
                            req.flash('error_msg', 'Houve um erro ao salvar o usuário! Tente novamente!');
                            res.redirect('/');
                        }
                        novoAdmin.senha = hash;

                        novoAdmin.save().then(()=>{
                            req.flash('success_msg', 'Administrador criado com sucesso!');
                            res.redirect('/');
                        }).catch((err)=>{
                            req.flash('error_msg', 'Houve um erro ao criar um administrador! Tente novamente!');
                            res.redirect('/admin/registro');
                        });
                    });
                });
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno no sistema, contate os desenvolvedores!');
            res.redirect('/');
        });
    }
});

router.get('/login', (req, res)=>{
    res.render('admin/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: 'eventos',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next)
});

router.get('/cursos', eAdmin, (req, res)=>{
    Curso.find().then((cursos)=>{
        res.render('admin/cursos', {cursos: cursos});
    }).catch(()=>{
        req.flash('error_msg', 'Houve um erro ao listar os cursos do banco de dados');
        res.redirect('/admin');
    });
});

router.get('/cursos/add', eAdmin, (req, res)=>{
    res.render('admin/addCursos');
});

router.post('/cursos/novo', eAdmin, (req, res)=>{
    var errors = new Array();

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        error.push({text: 'Nome para o curso inválido!'});
    }

    if(!req.body.desc || typeof req.body.desc == undefined || req.body.desc == null){
        errors.push({text: 'Descrição para o curso inválida!'});
    }

    if(!req.body.duracao || typeof req.body.duracao == undefined || req.body.duracao == null){
        errors.push({text: 'Duração do curso inválida!'});
    }

    if(!req.body.dt || typeof req.body.dt == undefined || req.body.dt == null){
        errors.push({text: 'Data de início do curso inválida!'});
    }

    if(!req.body.professor || typeof req.body.professor == undefined || req.body.professor == null){
        errors.push({text: 'Nome do professor inválido!'});
    }

    if(!req.body.sala || typeof req.body.sala == undefined || req.body.sala == null){
        errors.push({text: 'Sala inválida!'});
    }

    if(!req.body.vagas || typeof req.body.vagas == undefined || req.body.vagas == null){
        errors.push({text: 'Número de vagas inválido!'});
    }

    if(req.body.nome.length < 2){
        errors.push({text: 'Nome para o curso muito curto, tente novamente!'});
    }

    if(errors.length > 0){
        res.render('admin/addCursos', {errors: errors});
    }else{
        const novoCurso = {
            nome: req.body.nome,
            desc: req.body.desc,
            duracao: req.body.duracao,
            dt: req.body.dt,
            professor: req.body.professor,
            sala: req.body.sala,
            vagas: req.body.sala
        }

        new Curso(novoCurso).save().then(()=>{
            req.flash('success_msg', 'O curso foi cadastrado com sucesso!');
            res.redirect('/admin/cursos');
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao cadastrar o curso, tente novamente!');
            res.redirect('/admin');
        });
    }
});

router.get('/cursos/edit/:id', eAdmin, (req, res)=>{
    Curso.findOne({_id:req.params.id}).then((curso)=>{
        res.render('admin/editCursos', {curso: curso});
    }).catch((err)=>{
        req.flash('error_msg', 'Curso inexistente na base de dados');
        res.redirect('/admin/cursos');
    });
});

router.post('/cursos/edit', eAdmin, (req, res)=>{
    Curso.findOne({_id:req.body.id}).then((curso)=>{
        curso.nome = req.body.nome;
        curso.desc = req.body.desc;
        curso.duracao = req.body.duracao;
        curso.dt = req.body.dt;
        curso.professor = req.body.professor;
        curso.sala = req.body.sala;
        curso.vagas = req.body.vagas;
        curso.save().then(()=>{
            req.flash('success_msg', 'Curso editado com sucesso!');
            res.redirect('/admin/cursos');
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição do curso, tente novamente!');
            res.redirect('/admin/cursos');
        });
    }).catch((err)=>{
        req.flash('error_msg', 'Ocorreu um erro ao editar o curso, tente novamente!' + err);
        res.redirect('/admin/cursos');
    });
});

router.post('/cursos/deletar', eAdmin, (req, res)=>{
    Curso.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Curso deletado com sucesso!');
        res.redirect('/admin/cursos');
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar o curso, tente novamente!');
        res.redirect('/admin/cursos');
    });
});

router.get('/eventos', eAdmin, (req, res)=>{
    Evento.find().then((eventos)=>{
        res.render('admin/eventos', {eventos: eventos});
    }).catch(()=>{
        req.flash('error_msg', 'Houve um erro ao listar os eventos do banco de dados');
        res.redirect('/admin');
    });
});

router.get('/eventos/add', eAdmin, (req, res)=>{
    res.render('admin/addEventos');
});

router.post('/eventos/novo', eAdmin, (req, res)=>{
    var errors = new Array();

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errors.push({text: 'Nome inválido'});
    }

    if(!req.body.vagas || typeof req.body.vagas == undefined || req.body.vagas == null){
        errors.push({text: 'Número de vagas inválido'});
    }

    if(!req.body.desc || typeof req.body.desc == undefined || req.body.desc == null){
        errors.push({text: 'Descrição inválida'});
    }

    if(!req.body.dt || typeof req.body.dt == undefined || req.body.dt == null){
        errors.push({text: 'Data inválida'});
    }

    if(req.body.nome.length < 2){
        errors.push({text: 'Nome do evento muito curto'});
    }

    if(errors.length > 0){
        res.render("admin/addEventos", {errors: errors});
    }else{
        const novoEvento = {
            nome: req.body.nome,
            vagas: req.body.vagas,
            desc: req.body.desc,
            dt: req.body.dt
        }
    
        new Evento(novoEvento).save().then(()=>{
            req.flash('success_msg', 'O evento foi cadastrado com sucesso');
            res.redirect('/admin/eventos');
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao cadastrar o evento, tente novamente!');
            res.redirect('/admin');
        });
    }
});

router.get('/eventos/edit/:id', eAdmin, (req, res)=>{
    Evento.findOne({_id:req.params.id}).then((evento)=>{
        res.render('admin/editEventos', {evento: evento});
    }).catch((err)=>{
        req.flash('error_msg', 'Evento inexistente na base de dados');
        res.redirect('/admin/eventos');
    });
});

router.post('/eventos/edit', eAdmin, (req, res)=>{
    Evento.findOne({_id: req.body.id}).then((evento)=>{
        evento.nome = req.body.nome;
        evento.vagas = req.body.vagas;
        evento.desc = req.body.desc;
        evento.dt = req.body.dt;
        evento.save().then(()=>{
            req.flash('success_msg', 'Evento editado com sucesso!');
            res.redirect('/admin/eventos');
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição do evento, tente novamente!' + err);
            res.redirect('/admin/eventos');
        });
    }).catch((err)=>{
        req.flash('error_msg', 'Ocorreu um erro ao editar o evento, tente novamente!');
        res.redirect('/admin/eventos');
    });
});

router.post('/eventos/deletar', eAdmin, (req, res)=>{
    Evento.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Evento deletado com sucesso!');
        res.redirect('/admin/eventos');
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar o evento, tente novamente!');
        res.redirect('/admin/eventos');
    });
});

router.get('/postagens', eAdmin, (req, res)=>{
    Postagem.find().populate('evento').sort({data: 'desc'}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens});
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as postagens do banco de dados!');
        res.redirect('/admin');
    });
});

router.get('/postagens/add', eAdmin, (req, res)=>{
    Evento.find().then((eventos)=>{
        res.render('admin/addPostagem', {eventos: eventos});
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao caregar o formulário!');
        res.redirect('/admin');
    });
});

router.post('/postagens/nova', eAdmin, (req, res)=>{
    var errors = new Array();

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        errors.push({text: 'Título da postagem inválido!'});
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        errors.push({text: 'Descrição inválida!'});
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        errors.push({text: 'Conteúdo inválido!'});
    }

    if(req.body.evento == '0'){
        errors.push({text: 'Categoria inválida!'});
    }

    if(errors.length > 0){
        res.render('admin/addPostagem', {errors: errors});
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            evento: req.body.evento
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg', 'Postagem divulgada com sucesso!');
            res.redirect('/admin/postagens');
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao divulgar a postagem, tente novamente!');
            res.redirect('/admin/postagens');
        });
    }
});

router.get('/postagens/edit/:id', eAdmin, (req, res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagem)=>{
        Evento.find().then((eventos)=>{
            res.render('admin/editPostagens', {
                eventos: eventos, 
                postagem: postagem
            });
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao listar os eventos');
            res.redirect('/admin/postagens');
        });
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição');
        res.redirect('/admin/postagens')
    });
});

router.post('/postagem/edit', eAdmin, (req, res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.evento = req.body.evento;
        postagem.save().then(()=>{
            req.flash('success_msg', 'Edição salva com sucesso!');
            res.redirect('/admin/postagens');
        }).catch(()=>{
            req.flash('error_msg', 'Não foi possível salvar a edição do post, tente novamente!');
            res.redirect('/admin/postagens');
        });
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao salvar a edição, tente novamente!' + err);
        res.redirect('/admin/postagens');
    });
});

router.get('/postagens/deletar/:id', eAdmin, (req, res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash('success_msg', 'Sua postagem foi excluida com sucesso!');
        res.redirect('/admin/postagens');
    }).catch((err)=>{
        req.flash('error_msg', 'Não foi possível excluir sua postagem, tente novamente!');
        res.redirect('/admin/postagens');
    });
});
module.exports = router;