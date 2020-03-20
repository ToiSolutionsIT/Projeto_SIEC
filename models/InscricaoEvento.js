const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    vagasRes: {
        type: Schema.Types.ObjectId,
        ref: 'eventos',
        required: false
    },
    data:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('inscricaoEventos', InscricaoEvento);