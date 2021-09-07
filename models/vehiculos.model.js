const mongoose = require('mongoose');

//schema de usuarios
const vehiculos = new mongoose.Schema({

    tipo:{
        type:String,
        required:true
    }

    


});

module.exports = mongoose.model('Vehiculos', vehiculos)