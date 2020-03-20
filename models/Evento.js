const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Evento = new Schema({
    nome:{
        type: String,
        required: true
    },
    vagas:{
        type: Number,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    dt:{
        type: String,
        required: true
    }
});

mongoose.model('eventos', Evento);