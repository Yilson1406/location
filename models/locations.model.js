const mongoose = require('mongoose');

const user = mongoose.Schema;
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
        type:String,
        default: new Date()
    },
    foto:{
        type:String,
        required:false
    },
    user: {
        type:user.Types.ObjectId, ref:'Usuarios'
    }

});

module.exports = mongoose.model('Locations', locations)