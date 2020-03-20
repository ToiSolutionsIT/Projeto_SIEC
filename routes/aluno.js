const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Evento');
const Evento = mongoose.model("eventos");
require('../models/Curso');
const Curso = mongoose.model("cursos");
require('../models/Postagem');
const Postagem = mongoose.model("postagens");
require('../models/InscricaoCurso');
const Insc = mongoose.model("inscricaoCursos");
const InscEvent = mongoose.model('inscricaoEventos');

router.get('/', (req, res)=>{
    res.render("aluno/inscricoes");
});

router.get('/inscricoesEvents', (req, res)=>{
    InscEvent.find().populate('evento').then((inscricoesEvents)=>{
        res.render('aluno/inscricoesEvents', {inscricoesEvents: inscricoesEvents});
    }).catch(()=>{
        req.flash('error_msg', 'Houve um erro ao listar os eventos do banco de dados');
        res.redirect('/aluno');
    });
});

router.get('/inscricoesEvents/cadEvents', (req, res)=>{
    Evento.find().then((eventos)=>{
        res.render('aluno/cadEvents', {eventos: eventos});
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao caregar o formulário!');
        res.redirect('/aluno');
    });
});

router.post('/inscricoesEvents/cadEvents', (req, res)=>{
    var errors = new Array();

    if(req.body.evento == '0'){
        errors.push({text: 'Evento inválido!'});
    }

    if(errors.length > 0){
        res.render('aluno/cadEvents', {errors: errors});
    }else{
        const novaInscricaoEvent = {
            evento: req.body.evento
        }

        Evento.find({$and: [{evento: req.body.id}, {vagas: {$gte: 1}}]}).then((vagas)=>{
            if(vagas){
                new InscEvent(novaInscricaoEvent).save().then(()=>{
                    req.flash('success_msg', 'Inscrição realizada com sucesso!');
                    res.redirect('/aluno/inscricoesEvents');
                }).catch((err)=>{
                    req.flash('error_msg', 'Erro ao realizar sua inscrição, tente novamente!' + err);
                    res.redirect('/aluno/inscricoesEvents');
                });
            }else{
                req.flash('error_msg', 'Não foi possível realizar a sua inscrição, pois você já está cadastrado em um evento!');
                res.redirect('/aluno/inscricoesEvents');
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao solicitar a inscrição!');
            res.redirect('/aluno/inscricoesEvents');
        });

    }
});

router.post('/inscricoesEvents/deletar', (req, res)=>{
    InscEvent.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Inscrição cancelada com sucesso!');
        res.redirect('/aluno/inscricoesEvents');
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao cancelar sua inscrição, tente novamente!');
        res.redirect('/aluno/inscricoesEvents');
    });
});

router.get('/inscricoes', (req, res)=>{
    Insc.find().populate('curso').then((inscricoes)=>{
        res.render('aluno/inscricoes', {inscricoes: inscricoes});
    }).catch(()=>{
        req.flash('error_msg', 'Houve um erro ao listar os cursos do banco de dados');
        res.redirect('/aluno');
    });
});

router.get('/inscricoes/cad', (req, res)=>{
    Curso.find().then((cursos)=>{
        res.render('aluno/cadCursos', {cursos: cursos});
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao caregar o formulário!');
        res.redirect('/aluno');
    });
});

router.post('/inscricoes/cadCurso', (req, res)=>{
    var errors = new Array();

    if(req.body.curso == '0'){
        errors.push({text: 'Curso inválido!'});
    }

    if(errors.length > 0){
        res.render('aluno/cadCurso', {errors: errors});
    }else{
        const novaInscricao = {
            curso: req.body.curso
        }

        new Insc(novaInscricao).save().then(()=>{
            req.flash('success_msg', 'Inscrição realizada com sucesso!');
            res.redirect('/aluno/inscricoes');
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao realizar sua inscrição, tente novamente!' + err);
            res.redirect('/aluno/inscricoes');
        });
    }
});

router.post('/inscricoes/deletar', (req, res)=>{
    Insc.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Inscrição cancelada com sucesso!');
        res.redirect('/aluno/inscricoes');
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao cancelar sua inscrição, tente novamente!');
        res.redirect('/aluno/inscricoes');
    });
});
module.exports = router;