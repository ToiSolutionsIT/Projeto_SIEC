const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    evento:{
        type: Schema.Types.ObjectId,
        ref: "eventos",
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", Postagem)