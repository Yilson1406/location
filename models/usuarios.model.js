const mongoose = require('mongoose');

//schema de usuarios
const usuarios = new mongoose.Schema({

    nombres:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    telefono:{
        type:String,
        required:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    password:{
        type:String,
        required:true
    },
    tipo_vehiculo:{
        type:String,
        required:true

    },
    color_vehiculo:{
        type:String,
        required:true
    },
    placa:{
        type:String,
        required:true
    },
    chasis:{
        type:Number,
        required:true
    },
    rol:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Usuarios', usuarios)