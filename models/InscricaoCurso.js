const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InscricaoCurso = new Schema({
    aluno:{
        type: Schema.Types.ObjectId,
        ref: 'alunos',
        required: false
    },
    curso:{
        type: Schema.Types.ObjectId,
        ref: 'cursos',
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('inscricaoCursos', InscricaoCurso);

const InscricaoEvento = new Schema({
    aluno:{
        type: Schema.Types.ObjectId,
        ref: 'alunos',
        required: false
    },
    evento:{
        type: Schema.Types.ObjectId,
        ref: 'eventos',
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('inscricaoEventos', InscricaoEvento);