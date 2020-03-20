const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Aluno = new Schema({
    ra:{
        type: String,
        required: true
    },
    nome:{
        type: String,
        required: true
    },
    periodo:{
        type: String,
        required: true
    },
    classe:{
        type: String,
        required: true
    }
});

mongoose.model('alunos', Aluno);