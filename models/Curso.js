const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Curso = new Schema({
    nome:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    duracao:{
        type: String,
        required: true
    },
    dt:{
        type: String,
        required: true
    },
    professor:{
        type: String,
        required: true
    },
    sala:{
        type: String,
        required: true
    },
    vagas:{
        type: String,
        required: true
    }
});

mongoose.model('cursos', Curso);