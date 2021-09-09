const mongoose = require('mongoose');

//schema de usuarios
const locations = new mongoose.Schema({

    latitud:{
        type:String,
        required:true
    },
    longitud:{
        type:String,
        required:true
    },
    fecha_location:{
        type:Date,
        default: new Date(),
        required:true
    },
    foto:{
        type:String,
        required:false
    }

});

module.exports = mongoose.model('Locations', locations)